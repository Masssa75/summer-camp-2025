#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample data from the sheets (we'll add full CSV parsing if needed)
const explorerCampData = [
  {
    email: 'jiaolei1986@gmail.com',
    child_name: 'Amanda Yoshioka',
    gender: 'Girl',
    date_of_birth: '2016-04-17',
    weeks: [7],
    payment_status: 'paid',
    payment_amount: 5000
  },
  {
    email: 'assafster@gmail.com',
    child_name: 'Tom Cohen',
    gender: 'Girl', 
    date_of_birth: '2016-04-06',
    weeks: [4, 5, 6],
    payment_status: 'paid',
    payment_amount: 15000
  }
];

const miniCampData = [
  {
    email: 'assafster@gmail.com',
    child_name: 'Ellie Cohen',
    gender: 'Girl',
    date_of_birth: '2019-05-15',
    weeks: [4, 5, 6],
    payment_status: 'paid',
    payment_amount: 15000
  },
  {
    email: 'nikizhang112233@gmail.com',
    child_name: 'Yin Jiao',
    nick_name: 'Bella',
    gender: 'Girl',
    date_of_birth: '2018-06-20',
    weeks: [4, 5],
    payment_status: 'paid',
    payment_amount: 10000
  }
];

async function importRegistrations() {
  console.log('Starting Google Sheets import...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  // Import Explorer Camp
  console.log('Importing Explorer Camp (7-13)...');
  for (const data of explorerCampData) {
    try {
      const registration = {
        email: data.email.toLowerCase(),
        child_name: data.child_name,
        nick_name: data.nick_name || data.child_name,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        age_group: 'explorer',
        current_school: 'Imported from Google Sheets',
        nationality_language: 'Not specified',
        parent_name_1: 'Parent of ' + data.child_name,
        parent_name_2: 'Not specified',
        mobile_phone_1: 'Not provided',
        mobile_phone_2: 'Not provided',
        wechat_whatsapp_1: 'Not provided',
        wechat_whatsapp_2: 'Not provided',
        emergency_contact: 'Same as parent',
        allergies: 'Not specified',
        health_behavioral_conditions: 'None',
        has_insurance: true,
        weeks_selected: data.weeks,
        photo_permission: true,
        how_did_you_find: 'Returning customer',
        terms_acknowledged: true,
        all_statements_true: true,
        payment_status: data.payment_status || 'pending',
        payment_amount: data.payment_amount,
        payment_date: data.payment_status === 'paid' ? new Date().toISOString() : null,
        imported_from: 'google_sheets',
        import_date: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('registrations')
        .insert(registration);
      
      if (error) {
        errors.push({ child: data.child_name, error: error.message });
        errorCount++;
      } else {
        console.log(`✓ Imported: ${data.child_name}`);
        successCount++;
      }
    } catch (err) {
      errors.push({ child: data.child_name, error: err.message });
      errorCount++;
    }
  }
  
  // Import Mini Camp
  console.log('\nImporting Mini Camp (3-6)...');
  for (const data of miniCampData) {
    try {
      const registration = {
        email: data.email.toLowerCase(),
        child_name: data.child_name,
        nick_name: data.nick_name || data.child_name,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        age_group: 'mini',
        current_school: 'Imported from Google Sheets',
        nationality_language: 'Not specified',
        parent_name_1: 'Parent of ' + data.child_name,
        parent_name_2: 'Not specified',
        mobile_phone_1: 'Not provided',
        mobile_phone_2: 'Not provided',
        wechat_whatsapp_1: 'Not provided',
        wechat_whatsapp_2: 'Not provided',
        emergency_contact: 'Same as parent',
        allergies: 'Not specified',
        health_behavioral_conditions: 'None',
        has_insurance: true,
        weeks_selected: data.weeks,
        photo_permission: true,
        how_did_you_find: 'Returning customer',
        terms_acknowledged: true,
        all_statements_true: true,
        payment_status: data.payment_status || 'pending',
        payment_amount: data.payment_amount,
        payment_date: data.payment_status === 'paid' ? new Date().toISOString() : null,
        imported_from: 'google_sheets',
        import_date: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('registrations')
        .insert(registration);
      
      if (error) {
        errors.push({ child: data.child_name, error: error.message });
        errorCount++;
      } else {
        console.log(`✓ Imported: ${data.child_name}`);
        successCount++;
      }
    } catch (err) {
      errors.push({ child: data.child_name, error: err.message });
      errorCount++;
    }
  }
  
  // Summary
  console.log('\n=== Import Summary ===');
  console.log(`✓ Successfully imported: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`- ${e.child}: ${e.error}`));
  }
  
  // Now process into normalized structure
  console.log('\n=== Processing into normalized structure ===');
  const { error } = await supabase.rpc('process_registrations_normalized');
  if (error) {
    console.error('Normalization error:', error);
  } else {
    console.log('✓ Normalized structure created');
  }
}

// Run import
importRegistrations();