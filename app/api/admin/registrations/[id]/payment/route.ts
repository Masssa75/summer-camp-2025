import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendTelegramMessage } from '@/utils/telegram'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { 
      payment_status, 
      payment_amount, 
      payment_date, 
      payment_method, 
      payment_reference,
      admin_notes
    } = await request.json()

    const { id } = await params
    const supabase = createClient()

    // Update registration with payment information
    const { data: registration, error } = await supabase
      .from('registrations')
      .update({
        payment_status,
        payment_amount,
        payment_date,
        payment_method,
        payment_reference,
        admin_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send notification to admin group
    try {
      const { getAdminTelegramIds } = await import('@/utils/telegram')
      const adminIds = await getAdminTelegramIds()
      const statusEmoji = payment_status === 'paid' ? '✅' : payment_status === 'partial' ? '⚠️' : '❌'
      const message = `${statusEmoji} Payment recorded for ${registration.child_name}\n\n` +
        `Status: ${payment_status.charAt(0).toUpperCase() + payment_status.slice(1)}\n` +
        `Amount: ฿${payment_amount?.toLocaleString() || 'N/A'}\n` +
        `Method: ${payment_method || 'N/A'}\n` +
        `Reference: ${payment_reference || 'N/A'}\n` +
        `Date: ${payment_date || 'N/A'}`
      
      // Send to all admins
      const notifications = adminIds.map(adminId => 
        sendTelegramMessage(adminId, message)
      )
      await Promise.allSettled(notifications)
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError)
      // Don't fail the request if Telegram fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment recorded successfully',
      registration 
    })

  } catch (error) {
    console.error('Error recording payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}