#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const csv = require('csv-parser');
const { Readable } = require('stream');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Direct CSV URLs
const EXPLORER_CSV_URL = 'https://docs.google.com/spreadsheets/d/1G7UBjwPsDfEDAeXWNecATYHHwY6RXJti2im_1NKXA00/export?format=csv&gid=1085152792';
const MINI_CSV_URL = 'https://docs.google.com/spreadsheets/d/12IIwb8mtZ-BeJm34RgFVvSw6r3xYyJ9pCFtD63Iix-g/export?format=csv&gid=1470510949';

const importStats = {
  explorer: { success: 0, errors: 0 },
  mini: { success: 0, errors: 0 },
  errors: []
};

// Helper to fetch CSV data
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 307) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          let data = '';
          redirectResponse.on('data', chunk => data += chunk);
          redirectResponse.on('end', () => resolve(data));
          redirectResponse.on('error', reject);
        }).on('error', reject);
      } else {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(data));
        response.on('error', reject);
      }
    }).on('error', reject);
  });
}

// Parse weeks string
function parseWeeks(weeksString) {
  if (!weeksString) return [];
  
  const weeks = [];
  const normalized = weeksString.replace(/[Ww]eek[s]?\s*/g, '').trim();
  
  // Handle ranges like "4-6"
  if (normalized.includes('-')) {
    const [start, end] = normalized.split('-').map(n => parseInt(n.trim()));
    for (let i = start; i <= end && i <= 7; i++) {
      weeks.push(i);
    }
  } 
  // Handle comma separated like "1, 2, 3"
  else if (normalized.includes(',')) {
    normalized.split(',').forEach(n => {
      const num = parseInt(n.trim());
      if (num >= 1 && num <= 7) weeks.push(num);
    });
  }
  // Single week
  else {
    const num = parseInt(normalized);
    if (num >= 1 && num <= 7) weeks.push(num);
  }
  
  return [...new Set(weeks)].sort((a, b) => a - b);
}

// Parse date
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // Try parsing as is
  let date = new Date(dateStr);
  if (!isNaN(date)) return date.toISOString().split('T')[0];
  
  // Try MM/DD/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    if (!isNaN(date)) return date.toISOString().split('T')[0];
  }
  
  return null;
}

// Process a row into registration
function processRow(row, ageGroup) {
  try {
    const registration = {
      // Required fields
      email: row['Email Address']?.trim().toLowerCase() || `noemail${Date.now()}@example.com`,
      child_name: row['Child Name']?.trim() || 'Unknown Child',
      nick_name: row['Nick Name']?.trim() || row['Child Name']?.trim() || 'Unknown',
      gender: row['Gender']?.trim() || 'Girl',
      date_of_birth: parseDate(row['Date of birth']) || '2018-01-01',
      age_group: ageGroup,
      
      // School info
      current_school: row['Current School']?.trim() || 'Not specified',
      nationality_language: row['Nationality and Language']?.trim() || 'Not specified',
      english_level: row["Child's English Level"]?.trim() || null,
      
      // Parent info
      parent_name_1: row['Parent Name 1']?.trim() || 'Parent',
      parent_name_2: row['Parent Name 2']?.trim() || 'Not specified',
      mobile_phone_1: row['Parent 1 Mobile Phone']?.trim() || 'Not provided',
      mobile_phone_2: row['Parent 2 Mobile Phone']?.trim() || 'Not provided',
      wechat_whatsapp_1: row['Parent 1 WeChat/WhatsApp ID']?.trim() || 'Not provided',
      wechat_whatsapp_2: row['Parent 2 WeChat/WhatsApp ID']?.trim() || 'Not provided',
      emergency_contact: row['Emergency Contact']?.trim() || 'Same as parent',
      
      // Health info
      allergies: row["Child's Allergies"]?.trim() || 'None',
      health_behavioral_conditions: row['Health Conditions']?.trim() || row['Health/Behavioral Conditions']?.trim() || 'None',
      has_insurance: !!row['Insurance Policy Link'] || !!row['Insurance Policy Upload Link'],
      
      // Camp details
      weeks_selected: parseWeeks(row['Weeks to Join']),
      
      // Permissions
      photo_permission: row['Photo Permission']?.toLowerCase().includes('yes') || row['Photo Permission']?.toLowerCase().includes('grant'),
      how_did_you_find: row['How They Found Out']?.trim() || row['How They Found Out About Camp']?.trim() || 'Not specified',
      terms_acknowledged: true,
      all_statements_true: true,
      
      // Payment info
      payment_status: row['Payment Received'] ? 'paid' : 'pending',
      payment_amount: row['Payment Amount'] ? parseFloat(row['Payment Amount'].replace(/[^0-9.-]+/g, '')) : null,
      payment_date: row['Payment Received'] ? parseDate(row['Payment Received']) : null,
      payment_request_sent: row['Payment Request Sent'] === 'sent' ? new Date().toISOString() : null,
      confirmation_email_sent: row['Confirmation Email Sent'] === 'sent' ? new Date().toISOString() : null,
      
      // Document URLs (keeping Google Drive links)
      child_passport_url: row["Child's Passport Link"] || row["Child's Passport Upload Link"] || null,
      parent_passport_1_url: row["Parent 1 Passport Link"] || row["Parent 1 Passport Upload Link"] || null,
      parent_passport_2_url: row["Parent 2 Passport Link"] || row["Parent 2 Passport Upload Link"] || null,
      insurance_policy_url: row["Insurance Policy Link"] || row["Insurance Policy Upload Link"] || null,
      
      // Metadata
      imported_from: 'google_sheets',
      import_date: new Date().toISOString(),
      admin_notes: `Imported from ${ageGroup} camp Google Sheet`
    };
    
    return registration;
  } catch (error) {
    console.error('Error processing row:', error);
    throw error;
  }
}

// Import a sheet
async function importSheet(url, ageGroup, sheetName) {
  console.log(`\nFetching ${sheetName}...`);
  
  try {
    const csvData = await fetchCSV(url);
    const rows = [];
    
    // Parse CSV
    await new Promise((resolve, reject) => {
      Readable.from(csvData)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${rows.length} rows in ${sheetName}`);
    
    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (!row['Child Name'] || !row['Email Address']) {
        continue;
      }
      
      try {
        const registration = processRow(row, ageGroup);
        
        // Insert into database
        const { error } = await supabase
          .from('registrations')
          .insert(registration);
        
        if (error) {
          console.error(`✗ Error importing ${registration.child_name}: ${error.message}`);
          importStats.errors.push({ child: registration.child_name, error: error.message });
          importStats[ageGroup].errors++;
        } else {
          console.log(`✓ Imported: ${registration.child_name}`);
          importStats[ageGroup].success++;
        }
        
      } catch (error) {
        console.error(`✗ Error processing row ${i + 1}: ${error.message}`);
        importStats[ageGroup].errors++;
      }
    }
    
  } catch (error) {
    console.error(`Failed to import ${sheetName}:`, error.message);
  }
}

// Main import function
async function importAll() {
  console.log('Starting full Google Sheets import...');
  console.log('=====================================');
  
  // Import both sheets
  await importSheet(EXPLORER_CSV_URL, 'explorer', 'Explorer Camp (7-13)');
  await importSheet(MINI_CSV_URL, 'mini', 'Mini Camp (3-6)');
  
  // Print summary
  console.log('\n=====================================');
  console.log('Import Summary:');
  console.log(`Explorer Camp: ${importStats.explorer.success} success, ${importStats.explorer.errors} errors`);
  console.log(`Mini Camp: ${importStats.mini.success} success, ${importStats.mini.errors} errors`);
  console.log(`Total: ${importStats.explorer.success + importStats.mini.success} imported`);
  
  if (importStats.errors.length > 0) {
    console.log('\nErrors:');
    importStats.errors.forEach(e => console.log(`- ${e.child}: ${e.error}`));
  }
  
  // Process into normalized structure
  console.log('\nProcessing into normalized structure...');
  try {
    const { error } = await supabase.rpc('process_all_registrations');
    if (!error || error.message.includes('function')) {
      // If function doesn't exist, run the script
      console.log('Running normalization script...');
      require('./process-registrations-normalized.js');
    }
  } catch (err) {
    // Run the normalization script
    console.log('Running normalization script...');
    const { execSync } = require('child_process');
    execSync('node scripts/process-registrations-normalized.js', { stdio: 'inherit' });
  }
}

// Run the import
importAll().catch(console.error);