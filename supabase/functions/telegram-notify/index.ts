import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')

interface Registration {
  child_name: string
  age_group: string
  parent_name_1: string
  email: string
  weeks_selected: number[]
  created_at: string
}

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration missing')
    }

    // Format the message
    const message = formatRegistrationMessage(record)
    
    // Send to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

function formatRegistrationMessage(reg: Registration): string {
  const campType = reg.age_group === 'mini' ? 'Mini Camp (3-6)' : 'Explorer Camp (7-13)'
  const weeks = reg.weeks_selected.join(', ')
  const date = new Date(reg.created_at).toLocaleString()
  
  return `
🎉 <b>New Summer Camp Registration!</b>

👦 <b>Child:</b> ${reg.child_name}
🏕️ <b>Camp:</b> ${campType}
📅 <b>Weeks:</b> ${weeks}

👨‍👩‍👧 <b>Parent:</b> ${reg.parent_name_1}
📧 <b>Email:</b> ${reg.email}

🕐 <b>Registered at:</b> ${date}

<a href="${Deno.env.get('SITE_URL')}/admin">View in Admin Panel</a>
  `.trim()
}