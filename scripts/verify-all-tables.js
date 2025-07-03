const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyAllTables() {
  console.log('🔍 Verifying all database tables...\n')
  
  const tables = [
    { name: 'registrations', description: 'Camp registration data' },
    { name: 'admin_users', description: 'Authorized admin users' },
    { name: 'admin_notifications', description: 'Admin notification records' },
    { name: 'camp_settings', description: 'Camp configuration settings' }
  ]
  
  for (const table of tables) {
    try {
      console.log(`📋 Checking ${table.name} (${table.description})...`)
      
      // Try to count rows
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
      } else {
        console.log(`   ✅ Table exists with ${count || 0} rows`)
        
        // Special checks for specific tables
        if (table.name === 'camp_settings') {
          const { data: timetable } = await supabase
            .from('camp_settings')
            .select('value')
            .eq('key', 'timetable')
            .single()
          
          if (timetable) {
            console.log(`   📅 Timetable configured with ${timetable.value.length} time slots`)
          }
        }
      }
      
    } catch (err) {
      console.log(`   ❌ Unexpected error: ${err.message}`)
    }
    
    console.log('')
  }
  
  console.log('✨ Database verification complete!')
}

verifyAllTables()