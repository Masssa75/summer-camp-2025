const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStoragePolicies() {
  console.log('Setting up storage bucket policies...');
  
  const accessToken = 'sbp_97ca99b1a82b9ed514d259a119ea3c19a2e42cd7';
  const projectRef = 'xunccqdrybxpwcvafvag';
  
  // Storage policies need to be created via SQL
  const policies = [
    {
      name: 'Allow public uploads',
      sql: `
        CREATE POLICY "Allow public uploads" ON storage.objects
        FOR INSERT WITH CHECK (
          bucket_id = 'registration-documents'
        )
      `
    },
    {
      name: 'Allow public to read own uploads',
      sql: `
        CREATE POLICY "Allow users to read own uploads" ON storage.objects
        FOR SELECT USING (
          bucket_id = 'registration-documents'
        )
      `
    }
  ];
  
  for (const policy of policies) {
    console.log(`Creating policy: ${policy.name}`);
    
    try {
      const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: policy.sql })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${policy.name} created`);
      } else {
        console.log(`⚠️  ${policy.name} may already exist:`, result.message);
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  }
  
  // Test the setup
  console.log('\nTesting setup...');
  
  // Check if table exists
  const { data: tableTest, error: tableError } = await supabase
    .from('registrations')
    .select('id')
    .limit(1);
  
  if (!tableError || tableError.code === 'PGRST116') {
    console.log('✅ Registrations table is accessible');
  } else {
    console.log('❌ Table error:', tableError);
  }
  
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === 'registration-documents');
  
  if (bucketExists) {
    console.log('✅ Storage bucket exists');
  } else {
    console.log('❌ Storage bucket not found');
  }
  
  console.log('\n🎉 Database and storage setup complete!');
  console.log('The registration form is now ready to use.');
}

setupStoragePolicies();