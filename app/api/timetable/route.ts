import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('camp_settings')
      .select('value')
      .eq('key', 'timetable')
      .single()

    if (error) {
      console.error('Error fetching timetable:', error)
      return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 })
    }

    return NextResponse.json({ timetable: data?.value || null })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}