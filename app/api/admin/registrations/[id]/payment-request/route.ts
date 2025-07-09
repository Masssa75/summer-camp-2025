import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendTelegramMessage } from '@/utils/telegram'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { amount, email } = await request.json()
    const { id } = await params
    const supabase = createClient()

    // Update registration with payment request sent timestamp
    const { data: registration, error } = await supabase
      .from('registrations')
      .update({
        payment_request_sent: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating registration:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send notification to admin group
    try {
      const { getAdminTelegramIds } = await import('@/utils/telegram')
      const adminIds = await getAdminTelegramIds()
      const message = `📧 Payment request sent to ${registration.child_name}'s parent (${email})\n\n` +
        `Amount: ฿${amount.toLocaleString()}\n` +
        `Camp: ${registration.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'}\n` +
        `Weeks: ${registration.weeks_selected?.join(', ') || 'N/A'}`
      
      // Send to all admins
      const notifications = adminIds.map(adminId => 
        sendTelegramMessage(adminId, message)
      )
      await Promise.allSettled(notifications)
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError)
      // Don't fail the request if Telegram fails
    }

    // TODO: Send actual payment request email here
    // This would integrate with your email service
    console.log(`Payment request sent to ${email} for ฿${amount}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Payment request sent successfully' 
    })

  } catch (error) {
    console.error('Error sending payment request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}