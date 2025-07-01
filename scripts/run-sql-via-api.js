const fs = require('fs');
const path = require('path');

// Using Supabase Management API to run SQL
async function runSQL() {
  const accessToken = 'sbp_97ca99b1a82b9ed514d259a119ea3c19a2e42cd7';
  const projectRef = 'xunccqdrybxpwcvafvag';
  
  // Read the SQL file
  const sqlPath = path.join(__dirname, '../supabase/migrations/001_create_registrations.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Split into individual statements (removing comments and empty lines)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
    .map(s => s + ';');
  
  console.log(`Found ${statements.length} SQL statements to execute`);
  
  // Use the Supabase Management API to run SQL
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`\nExecuting statement ${i + 1}/${statements.length}:`);
    console.log(statement.substring(0, 100) + '...');
    
    try {
      const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: statement
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success');
      } else {
        const error = await response.text();
        console.log('❌ Failed:', error);
        
        // Try alternative endpoint
        console.log('Trying alternative approach...');
        const altResponse = await fetch(`https://api.supabase.com/v1/pg-meta/${projectRef}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Connection-Encrypted': 'true',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: statement
          })
        });
        
        if (altResponse.ok) {
          console.log('✅ Success via pg-meta');
        } else {
          console.log('Alternative also failed:', await altResponse.text());
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

runSQL();