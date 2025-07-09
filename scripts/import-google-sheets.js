#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Dynamic import for node-fetch
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sheet URLs (CSV exports)
const EXPLORER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1G7UBjwPsDfEDAeXWNecATYHHwY6RXJti2im_1NKXA00/export?format=csv&gid=1085152792';
const MINI_SHEET_URL = 'https://docs.google.com/spreadsheets/d/12IIwb8mtZ-BeJm34RgFVvSw6r3xYyJ9pCFtD63Iix-g/export?format=csv&gid=1470510949';

// Import report
const importReport = {
  successful: [],
  skipped: [],
  errors: [],
  duplicates: []
};

// Helper functions
function parseWeeks(weeksString) {
  if (!weeksString) return [];
  
  const weeks = [];
  // Handle formats like "Week 1, Week 2, Week 3" or "Weeks 4-6" or "Week 7"
  const parts = weeksString.split(/,|and/i);
  
  parts.forEach(part => {
    part = part.trim();
    
    // Handle range format "Weeks 4-6" or "Week 4-6"
    const rangeMatch = part.match(/(?:Week|Weeks?)\s*(\d+)\s*-\s*(\d+)/i);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      for (let i = start; i <= end; i++) {
        weeks.push(i);
      }
      return;
    }
    
    // Handle single week "Week 1" or "Weeks 1"
    const singleMatch = part.match(/(?:Week|Weeks?)\s*(\d+)/i);
    if (singleMatch) {
      weeks.push(parseInt(singleMatch[1]));
    }
  });
  
  // Remove duplicates and sort
  return [...new Set(weeks)].sort((a, b) => a - b);
}

function parseDate(dateString) {
  if (!dateString) return null;
  
  // Try different date formats
  const date = new Date(dateString);
  if (!isNaN(date)) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  
  // Try MM/DD/YYYY format
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    const parsed = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    if (!isNaN(parsed)) {
      return parsed.toISOString().split('T')[0];
    }
  }
  
  return null;
}

function parsePaymentAmount(amountString) {
  if (!amountString) return null;
  
  // Remove currency symbols and commas
  const cleaned = amountString.replace(/[฿,\s]/g, '');
  const amount = parseFloat(cleaned);
  
  return isNaN(amount) ? null : amount;
}

function parseBoolean(value) {
  if (!value) return false;
  const lowered = value.toLowerCase();
  return lowered === 'yes' || lowered === 'granted' || lowered === 'true';
}

function extractGoogleDriveId(url) {
  if (!url) return null;
  
  // Extract file ID from Google Drive URL
  const patterns = [
    /\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /open\?id=([a-zA-Z0-9-_]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

async function downloadAndUploadFile(googleDriveUrl, fileName, bucket = 'registration-documents') {
  if (!googleDriveUrl) return null;
  
  try {
    const fileId = extractGoogleDriveId(googleDriveUrl);
    if (!fileId) {
      console.warn('Could not extract Google Drive ID from:', googleDriveUrl);
      return null;
    }
    
    // Download from Google Drive
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      console.warn('Failed to download file:', downloadUrl);
      return null;
    }
    
    const buffer = await response.buffer();
    
    // Upload to Supabase Storage
    const filePath = `imports/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: 'application/octet-stream'
      });
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('File processing error:', error);
    return null;
  }
}

async function transformRow(row, ageGroup) {
  try {
    // Basic field mapping
    const registration = {
      // Contact info
      email: row['Email Address']?.trim().toLowerCase(),
      
      // Child info
      child_name: row['Child Name']?.trim(),
      nick_name: row['Nick Name']?.trim() || row['Child Name']?.trim(),
      gender: row['Gender']?.trim(),
      date_of_birth: parseDate(row['Date of birth']),
      age_group: ageGroup,
      
      // School info
      current_school: row['Current School']?.trim() || 'Not specified',
      nationality_language: row['Nationality and Language']?.trim() || 'Not specified',
      english_level: row["Child's English Level"]?.trim() || null,
      
      // Parents info
      parent_name_1: row['Parent Name 1']?.trim(),
      parent_name_2: row['Parent Name 2']?.trim() || 'Not specified',
      
      // Health info
      allergies: row["Child's Allergies"]?.trim() || 'None',
      health_behavioral_conditions: row['Health Conditions']?.trim() || row['Health/Behavioral Conditions']?.trim() || 'None',
      has_insurance: !!row['Insurance Policy Link'] || !!row['Insurance Policy Upload Link'],
      
      // Camp details
      weeks_selected: parseWeeks(row['Weeks to Join']),
      
      // Permissions
      photo_permission: parseBoolean(row['Photo Permission']),
      how_did_you_find: row['How They Found Out']?.trim() || row['How They Found Out About Camp']?.trim() || 'Not specified',
      terms_acknowledged: parseBoolean(row['Confirmation/Acceptance']) || parseBoolean(row['Additional Notes']),
      all_statements_true: parseBoolean(row['Confirmation/Acceptance']) || parseBoolean(row['Additional Notes']),
      
      // Payment tracking
      payment_status: row['Payment Received'] ? 'paid' : 'pending',
      payment_amount: parsePaymentAmount(row['Payment Amount']),
      payment_date: row['Payment Received'] ? parseDate(row['Payment Received']) : null,
      payment_request_sent: row['Payment Request Sent'] === 'sent' ? new Date().toISOString() : null,
      confirmation_email_sent: row['Confirmation Email Sent'] === 'sent' ? new Date().toISOString() : null,
      
      // Import tracking
      imported_from: 'google_sheets',
      import_date: new Date().toISOString(),
      admin_notes: `Imported from ${ageGroup} camp Google Sheet`
    };
    
    // Parse contact information (different formats in each sheet)
    if (ageGroup === 'explorer') {
      // Explorer sheet has more structured contact fields
      registration.mobile_phone_1 = row['Parent 1 Mobile Phone']?.trim() || 'Not provided';
      registration.mobile_phone_2 = row['Parent 2 Mobile Phone']?.trim() || 'Not provided';
      registration.wechat_whatsapp_1 = row['Parent 1 WeChat/WhatsApp ID']?.trim() || 'Not provided';
      registration.wechat_whatsapp_2 = row['Parent 2 WeChat/WhatsApp ID']?.trim() || 'Not provided';
    } else {
      // Mini sheet has combined fields
      registration.mobile_phone_1 = row['Parent 1 Mobile Phone']?.trim() || 'Not provided';
      registration.mobile_phone_2 = row['Parent 2 Mobile Phone']?.trim() || 'Not provided';
      registration.wechat_whatsapp_1 = row['Parent 1 WeChat/WhatsApp ID']?.trim() || 'Not provided';
      registration.wechat_whatsapp_2 = row['Parent 2 WeChat/WhatsApp ID']?.trim() || 'Not provided';
    }
    
    registration.emergency_contact = row['Emergency Contact']?.trim() || 'Same as parent';
    
    // Download and upload files
    console.log(`Processing files for ${registration.child_name}...`);
    
    const childPassportUrl = row["Child's Passport Link"] || row["Child's Passport Upload Link"];
    if (childPassportUrl) {
      registration.child_passport_url = await downloadAndUploadFile(
        childPassportUrl,
        `${registration.child_name.replace(/\s+/g, '-')}-passport.pdf`
      );
    }
    
    const parent1PassportUrl = row["Parent 1 Passport Link"] || row["Parent 1 Passport Upload Link"];
    if (parent1PassportUrl) {
      registration.parent_passport_1_url = await downloadAndUploadFile(
        parent1PassportUrl,
        `${registration.parent_name_1.replace(/\s+/g, '-')}-passport.pdf`
      );
    }
    
    const parent2PassportUrl = row["Parent 2 Passport Link"] || row["Parent 2 Passport Upload Link"];
    if (parent2PassportUrl) {
      registration.parent_passport_2_url = await downloadAndUploadFile(
        parent2PassportUrl,
        `${registration.parent_name_2.replace(/\s+/g, '-')}-passport.pdf`
      );
    }
    
    const insuranceUrl = row["Insurance Policy Link"] || row["Insurance Policy Upload Link"];
    if (insuranceUrl) {
      registration.insurance_policy_url = await downloadAndUploadFile(
        insuranceUrl,
        `${registration.child_name.replace(/\s+/g, '-')}-insurance.pdf`
      );
    }
    
    return registration;
  } catch (error) {
    console.error('Error transforming row:', error);
    throw error;
  }
}

async function importSheet(url, ageGroup, sheetName) {
  console.log(`\nImporting ${sheetName}...`);
  
  try {
    // Fetch CSV data
    const response = await fetch(url);
    const csvText = await response.text();
    
    // Parse CSV
    const rows = [];
    await new Promise((resolve, reject) => {
      require('stream').Readable.from(csvText)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} rows in ${sheetName}`);
    
    // Process each row
    for (const row of rows) {
      try {
        // Skip empty rows
        if (!row['Email Address'] || !row['Child Name']) {
          importReport.skipped.push({
            reason: 'Missing email or child name',
            data: row
          });
          continue;
        }
        
        // Check for duplicates
        const { data: existing } = await supabase
          .from('registrations')
          .select('id, child_name')
          .eq('email', row['Email Address'].trim().toLowerCase())
          .eq('child_name', row['Child Name'].trim());
        
        if (existing && existing.length > 0) {
          importReport.duplicates.push({
            email: row['Email Address'],
            childName: row['Child Name'],
            existingId: existing[0].id
          });
          continue;
        }
        
        // Transform and insert
        const registration = await transformRow(row, ageGroup);
        
        const { data, error } = await supabase
          .from('registrations')
          .insert(registration)
          .select();
        
        if (error) {
          importReport.errors.push({
            error: error.message,
            data: row
          });
        } else {
          importReport.successful.push({
            id: data[0].id,
            childName: registration.child_name,
            email: registration.email
          });
          console.log(`✓ Imported: ${registration.child_name}`);
        }
        
      } catch (error) {
        importReport.errors.push({
          error: error.message,
          data: row
        });
        console.error(`✗ Error processing ${row['Child Name']}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error(`Failed to import ${sheetName}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting Google Sheets import...');
  console.log('================================');
  
  try {
    // Import Explorer Camp
    await importSheet(EXPLORER_SHEET_URL, 'explorer', 'Explorer Camp (7-13)');
    
    // Import Mini Camp
    await importSheet(MINI_SHEET_URL, 'mini', 'Mini Camp (3-6)');
    
    // Generate report
    const reportPath = path.join(__dirname, '..', 'google-sheets-import-report.md');
    const reportContent = `# Google Sheets Import Report
Generated: ${new Date().toLocaleString()}

## Summary
- ✅ Successfully imported: ${importReport.successful.length}
- ⏭️ Skipped (duplicates): ${importReport.duplicates.length}
- ⚠️ Skipped (invalid): ${importReport.skipped.length}
- ❌ Errors: ${importReport.errors.length}

## Successfully Imported
${importReport.successful.map(r => `- ${r.childName} (${r.email}) - ID: ${r.id}`).join('\n')}

## Duplicates (Already in Database)
${importReport.duplicates.map(d => `- ${d.childName} (${d.email}) - Existing ID: ${d.existingId}`).join('\n')}

## Skipped (Invalid Data)
${importReport.skipped.map(s => `- Reason: ${s.reason}\n  Data: ${JSON.stringify(s.data, null, 2)}`).join('\n\n')}

## Errors
${importReport.errors.map(e => `- Error: ${e.error}\n  Data: ${JSON.stringify(e.data, null, 2)}`).join('\n\n')}
`;
    
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\nImport report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run import
main();