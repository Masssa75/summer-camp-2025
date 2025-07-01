// Direct table creation using Supabase Management API
async function createRegistrationTable() {
  const accessToken = 'sbp_97ca99b1a82b9ed514d259a119ea3c19a2e42cd7';
  const projectRef = 'xunccqdrybxpwcvafvag';
  
  // Create table SQL
  const createTableSQL = `
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
    )
  `;
  
  console.log('Creating registrations table...');
  
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: createTableSQL
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Table created successfully!');
      
      // Create indexes
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email)',
        'CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC)',
        'CREATE INDEX IF NOT EXISTS idx_registrations_age_group ON public.registrations(age_group)'
      ];
      
      for (const indexSQL of indexes) {
        console.log('Creating index...');
        await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: indexSQL })
        });
      }
      
      // Enable RLS
      console.log('Enabling RLS...');
      await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY'
        })
      });
      
      // Create RLS policies
      console.log('Creating RLS policies...');
      const policies = [
        {
          name: 'Anyone can create registrations',
          sql: `CREATE POLICY "Anyone can create registrations" ON public.registrations FOR INSERT WITH CHECK (true)`
        },
        {
          name: 'Only admins can view registrations',
          sql: `CREATE POLICY "Only admins can view registrations" ON public.registrations FOR SELECT USING (false)`
        }
      ];
      
      for (const policy of policies) {
        await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: policy.sql })
        });
      }
      
      console.log('✅ Database setup complete!');
    } else {
      console.error('Failed to create table:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createRegistrationTable();