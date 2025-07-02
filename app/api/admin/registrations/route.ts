import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Admin registrations API called')
    
    // Create server-side client with service role access
    const supabase = createClient()
    console.log('Supabase client created')
    
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Query executed, rows:', registrations?.length, 'error:', error?.message)

    if (error) {
      console.error('Error fetching registrations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}