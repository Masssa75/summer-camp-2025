#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample data to test import (we'll add full CSV parsing later)
const sampleRegistrations = [
  {
    email: 'test.import1@example.com',
    child_name: 'Test Import Child 1',
    nick_name: 'Testy',
    gender: 'Boy',
    date_of_birth: '2018-05-15',
    age_group: 'mini',
    current_school: 'Test School',
    nationality_language: 'English',
    parent_name_1: 'Test Parent 1',
    parent_name_2: 'Test Parent 2',
    mobile_phone_1: '+66 81 234 5678',
    mobile_phone_2: '+66 82 345 6789',
    wechat_whatsapp_1: 'testparent1',
    wechat_whatsapp_2: 'testparent2',
    emergency_contact: 'Emergency Contact',
    allergies: 'None',
    health_behavioral_conditions: 'None',
    has_insurance: true,
    weeks_selected: [1, 2, 3],
    photo_permission: true,
    how_did_you_find: 'Google',
    terms_acknowledged: true,
    all_statements_true: true,
    payment_status: 'paid',
    payment_amount: 15000,
    payment_date: '2025-01-05',
    payment_request_sent: '2025-01-01T10:00:00Z',
    confirmation_email_sent: '2025-01-06T10:00:00Z',
    imported_from: 'google_sheets',
    import_date: new Date().toISOString(),
    admin_notes: 'Test import from Google Sheets'
  }
];

async function testImport() {
  console.log('Testing import functionality...');
  
  for (const registration of sampleRegistrations) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert(registration)
        .select();
      
      if (error) {
        console.error('Error inserting:', error);
      } else {
        console.log('Successfully imported:', data[0].child_name);
      }
    } catch (err) {
      console.error('Failed:', err);
    }
  }
}

// Create the full import report template
const reportTemplate = `# Google Sheets Import Report
Generated: ${new Date().toLocaleString()}

## Found Duplicates

### Explorer Camp (7-13)
**Duplicate Emails:**
- jiaolei1986@gmail.com (2 registrations)
- assafster@gmail.com (4 registrations) 
- nikizhang112233@gmail.com (3 registrations)
- moorelin520@gmail.com (2 registrations)
- ivyyezi0430@gmail.com (2 registrations)
- 18349397868@163.com (2 registrations)
- youzisenlin0714@163.com (2 registrations)

**Duplicate Children:**
- Tom Cohen (2 registrations)
- Ariel Cohen (2 registrations)
- Jinglai Jiang / Jiang jing lai (2 registrations)

### Mini Camp (3-6)
**Duplicate Emails:**
- assafster@gmail.com (2 registrations)
- nikizhang112233@gmail.com (4 registrations)
- annamelman3@gmail.com (3 registrations)
- claudegod716@gmail.com (2 registrations)
- 18349397868@163.com (2 registrations)
- sugarnes@gmail.com (2 registrations)
- valeriagarciaorellana@gmail.com (2 registrations)

**Note:** Many duplicates appear to be siblings from the same family.

## Import Status
⚠️ Full import pending - need to handle Google Sheets authentication and file downloads.

## Next Steps
1. Set up Google Sheets API access or use CSV export
2. Handle file downloads from Google Drive
3. Run full import with duplicate handling
`;

// Save the report
fs.writeFileSync(
  path.join(__dirname, '..', 'google-sheets-import-report.md'),
  reportTemplate
);

console.log('Report saved to google-sheets-import-report.md');
console.log('\nRunning test import...');
testImport();