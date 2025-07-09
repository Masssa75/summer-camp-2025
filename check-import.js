const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkImport() {
  // Check registrations
  const { count: regCount } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true });
  
  // Check parents
  const { count: parentCount } = await supabase
    .from('parents')
    .select('*', { count: 'exact', head: true });
    
  // Check students
  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });
    
  // Check enrollments
  const { count: enrollmentCount } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true });
  
  console.log('Import Results:');
  console.log(`- Registrations: ${regCount}`);
  console.log(`- Parents: ${parentCount}`);
  console.log(`- Students: ${studentCount}`);
  console.log(`- Enrollments: ${enrollmentCount}`);
}

checkImport();
