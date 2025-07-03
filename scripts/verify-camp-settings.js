const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyCampSettings() {
  try {
    console.log('Checking camp_settings table...')
    
    // Fetch the timetable
    const { data, error } = await supabase
      .from('camp_settings')
      .select('*')
      .eq('key', 'timetable')
      .single()

    if (error) {
      console.error('Error fetching timetable:', error)
      return
    }

    console.log('Timetable found!')
    console.log('Number of time slots:', data.value.length)
    console.log('First time slot:', JSON.stringify(data.value[0], null, 2))
    console.log('\n✅ Camp settings table is working correctly!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

verifyCampSettings()