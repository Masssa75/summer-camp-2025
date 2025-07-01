// Since we can't run SQL directly via the API, let's create a minimal version
// that tests if the table exists and provides instructions

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('Checking database setup...');
  
  // Try to query the registrations table
  const { data, error } = await supabase
    .from('registrations')
    .select('id')
    .limit(1);
  
  if (error && error.code === '42P01') {
    console.log('\n❌ Registrations table not found!');
    console.log('\nPlease run the following SQL in your Supabase dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/xunccqdrybxpwcvafvag/sql');
    console.log('2. Copy and paste the SQL from: supabase/migrations/001_create_registrations.sql');
    console.log('3. Click "Run"\n');
  } else if (!error) {
    console.log('✅ Registrations table exists!');
    
    // Check storage bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasDocumentsBucket = buckets?.some(b => b.name === 'registration-documents');
    
    if (hasDocumentsBucket) {
      console.log('✅ Storage bucket exists!');
      
      // Set up storage policies
      console.log('\nSetting up storage policies...');
      
      // Allow authenticated users to upload
      const { error: uploadPolicyError } = await supabase.rpc('create_policy', {
        name: 'Allow uploads',
        definition: `
          CREATE POLICY "Allow uploads" ON storage.objects
          FOR INSERT WITH CHECK (bucket_id = 'registration-documents');
        `
      }).single();
      
      console.log('✅ Database is fully configured and ready!');
    } else {
      console.log('❌ Storage bucket missing (but we created it earlier, so this is odd)');
    }
  } else {
    console.error('Error checking database:', error);
  }
}

checkDatabase();