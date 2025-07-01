const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRegistrations() {
  console.log('Fetching registrations...\n');
  
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching registrations:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No registrations found yet.');
    return;
  }
  
  console.log(`Found ${data.length} registration(s):\n`);
  
  data.forEach((reg, index) => {
    console.log(`--- Registration ${index + 1} ---`);
    console.log(`Child: ${reg.child_name} (${reg.nick_name})`);
    console.log(`Age Group: ${reg.age_group}`);
    console.log(`Email: ${reg.email}`);
    console.log(`Parents: ${reg.parent_name_1}, ${reg.parent_name_2}`);
    console.log(`Weeks: ${JSON.stringify(reg.weeks_selected)}`);
    console.log(`Created: ${new Date(reg.created_at).toLocaleString()}`);
    console.log(`Payment Status: ${reg.payment_status}`);
    console.log('');
  });
}

checkRegistrations();