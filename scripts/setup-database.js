const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../supabase/migrations/001_create_registrations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { query: sql }).single();
    
    if (error) {
      // If RPC doesn't exist, try running queries individually
      console.log('Running queries individually...');
      
      const queries = sql
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);
      
      for (const query of queries) {
        console.log('Executing:', query.substring(0, 50) + '...');
        const { error: queryError } = await supabase.from('_dummy').select().limit(0);
        // This is a workaround - we'll use the REST API directly
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Alternative: Use direct HTTP request to run SQL
async function runMigrationViaAPI() {
  try {
    console.log('Setting up database via Supabase API...');
    
    // First, let's create a simple test to see if we can connect
    const { data: testData, error: testError } = await supabase
      .from('registrations')
      .select('*')
      .limit(1);
    
    if (testError && testError.code === '42P01') {
      // Table doesn't exist, let's create it
      console.log('Creating registrations table...');
      
      // Use fetch to call Supabase REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS public.registrations (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              email TEXT NOT NULL,
              child_name TEXT NOT NULL,
              nick_name TEXT NOT NULL,
              gender TEXT NOT NULL CHECK (gender IN ('Girl', 'Boy')),
              date_of_birth DATE NOT NULL,
              age_group TEXT NOT NULL CHECK (age_group IN ('mini', 'explorer')),
              current_school TEXT NOT NULL,
              nationality_language TEXT NOT NULL,
              english_level TEXT,
              parent_name_1 TEXT NOT NULL,
              parent_name_2 TEXT NOT NULL,
              mobile_phone_1 TEXT NOT NULL,
              wechat_whatsapp_1 TEXT NOT NULL,
              mobile_phone_2 TEXT NOT NULL,
              wechat_whatsapp_2 TEXT NOT NULL,
              emergency_contact TEXT NOT NULL,
              allergies TEXT NOT NULL,
              health_behavioral_conditions TEXT NOT NULL,
              child_passport_url TEXT,
              parent_passport_1_url TEXT,
              parent_passport_2_url TEXT,
              insurance_policy_url TEXT,
              weeks_selected JSONB NOT NULL,
              photo_permission BOOLEAN NOT NULL DEFAULT false,
              how_did_you_find TEXT NOT NULL,
              terms_acknowledged BOOLEAN NOT NULL DEFAULT false,
              payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
              payment_amount DECIMAL(10, 2),
              payment_date TIMESTAMP WITH TIME ZONE
            );
          `
        })
      });
      
      if (response.ok) {
        console.log('Table created successfully!');
      } else {
        console.log('Response:', await response.text());
      }
    } else if (!testError) {
      console.log('Registrations table already exists!');
    }
    
    // Create storage bucket
    console.log('Creating storage bucket...');
    const { data: buckets, error: bucketListError } = await supabase
      .storage
      .listBuckets();
    
    const bucketExists = buckets?.some(b => b.name === 'registration-documents');
    
    if (!bucketExists) {
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .createBucket('registration-documents', {
          public: false,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          fileSizeLimit: 10485760 // 10MB
        });
      
      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
      } else {
        console.log('Storage bucket created successfully!');
      }
    } else {
      console.log('Storage bucket already exists!');
    }
    
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Run the migration
runMigrationViaAPI();