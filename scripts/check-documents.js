const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDocuments() {
  console.log('Checking document URLs in registrations...\n');
  
  const { data, error } = await supabase
    .from('registrations')
    .select('id, child_name, email, child_passport_url, parent_passport_1_url, parent_passport_2_url, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching registrations:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No registrations found.');
    return;
  }
  
  console.log(`Found ${data.length} registration(s):\n`);
  
  let totalWithDocs = 0;
  
  data.forEach((reg, index) => {
    const hasChildPassport = !!reg.child_passport_url;
    const hasParent1Passport = !!reg.parent_passport_1_url;
    const hasParent2Passport = !!reg.parent_passport_2_url;
    const hasAnyDoc = hasChildPassport || hasParent1Passport || hasParent2Passport;
    
    if (hasAnyDoc) totalWithDocs++;
    
    console.log(`--- Registration ${index + 1} ---`);
    console.log(`Child: ${reg.child_name}`);
    console.log(`Email: ${reg.email}`);
    console.log(`Child Passport: ${hasChildPassport ? '✓ ' + reg.child_passport_url : '✗ None'}`);
    console.log(`Parent 1 Passport: ${hasParent1Passport ? '✓ ' + reg.parent_passport_1_url : '✗ None'}`);
    console.log(`Parent 2 Passport: ${hasParent2Passport ? '✓ ' + reg.parent_passport_2_url : '✗ None'}`);
    console.log(`Created: ${new Date(reg.created_at).toLocaleString()}`);
    console.log('');
  });
  
  console.log(`Summary: ${totalWithDocs} out of ${data.length} registrations have at least one document uploaded.`);
}

checkDocuments();