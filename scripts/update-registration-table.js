// Update registration table with new fields
async function updateRegistrationTable() {
  const accessToken = 'sbp_97ca99b1a82b9ed514d259a119ea3c19a2e42cd7';
  const projectRef = 'xunccqdrybxpwcvafvag';
  
  const updates = [
    // Add has_insurance column
    `ALTER TABLE public.registrations 
     ADD COLUMN IF NOT EXISTS has_insurance BOOLEAN NOT NULL DEFAULT false`,
    
    // Add all_statements_true column
    `ALTER TABLE public.registrations 
     ADD COLUMN IF NOT EXISTS all_statements_true BOOLEAN NOT NULL DEFAULT false`,
    
    // Drop the insurance_policy_url column if it exists
    `ALTER TABLE public.registrations 
     DROP COLUMN IF EXISTS insurance_policy_url`
  ];
  
  console.log('Updating registrations table...');
  
  for (const sql of updates) {
    console.log('Running:', sql.substring(0, 50) + '...');
    
    try {
      const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Success');
      } else {
        console.log('⚠️  Warning:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  console.log('\n✅ Table updates complete!');
}

updateRegistrationTable();