/**
 * Telegram Bot Service for sending notifications
 */

interface TelegramMessage {
  chat_id: number
  text: string
  parse_mode?: 'HTML' | 'Markdown'
}

interface RegistrationData {
  child_name: string
  email: string
  age_group: string
  weeks_selected: number[]
  parent_name_1: string
  created_at: string
}

/**
 * Send a message to a specific Telegram chat
 */
export async function sendTelegramMessage(chatId: number, message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not configured')
    return false
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    
    const payload: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error('Telegram API error:', result)
      return false
    }

    console.log('Telegram message sent successfully to chat:', chatId)
    return true
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return false
  }
}

/**
 * Get list of admin Telegram IDs who should receive notifications
 */
export async function getAdminTelegramIds(): Promise<number[]> {
  // TODO: Replace with real admin Telegram IDs
  // Instructions to get your Telegram ID:
  // 1. Start a chat with @Bamboo_Valley_Admin_Bot
  // 2. Send any message
  // 3. Check the logs or use @userinfobot to get your ID
  
  const hardcodedAdmins: number[] = [
    // Real admin Telegram IDs
    5089502326, // Marc - Connected via bot
    123456789, // Test admin (placeholder)
  ]

  // Return the list even if empty (webhook will handle the case)
  if (hardcodedAdmins.length === 0) {
    console.warn('No admin Telegram IDs configured for notifications')
  }

  // TODO: Add database query to get admin users when admin_users table is properly set up
  // const supabase = createClient()
  // const { data: admins } = await supabase
  //   .from('admin_users')
  //   .select('telegram_id')
  //   .eq('is_active', true)
  //   .eq('receive_notifications', true)
  
  return hardcodedAdmins
}

/**
 * Format registration data into a nice Telegram message
 */
export function formatRegistrationMessage(registration: RegistrationData): string {
  const weeksList = registration.weeks_selected.join(', ')
  const campType = registration.age_group === 'mini' ? 'Mini Camp (3-6)' : 'Explorer Camp (7-13)'
  
  return `
🏕️ <b>New Summer Camp Registration!</b>

👶 <b>Child:</b> ${registration.child_name}
👨‍👩‍👧‍👦 <b>Parent:</b> ${registration.parent_name_1}
📧 <b>Email:</b> ${registration.email}
🎯 <b>Camp:</b> ${campType}
📅 <b>Weeks:</b> ${weeksList}
🕐 <b>Registered:</b> ${new Date(registration.created_at).toLocaleString()}

🔗 <a href="https://phuketsummercamp.com/admin">View in Admin Dashboard</a>
  `.trim()
}

/**
 * Send new registration notification to all admins
 */
export async function notifyAdminsOfNewRegistration(registration: RegistrationData): Promise<void> {
  try {
    const adminIds = await getAdminTelegramIds()
    const message = formatRegistrationMessage(registration)

    console.log(`Sending registration notification to ${adminIds.length} admins`)
    
    // Send to all admins
    const notifications = adminIds.map(adminId => 
      sendTelegramMessage(adminId, message)
    )
    
    const results = await Promise.allSettled(notifications)
    
    // Log results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        console.log(`✅ Notification sent to admin ${adminIds[index]}`)
      } else {
        console.error(`❌ Failed to send notification to admin ${adminIds[index]}`)
      }
    })
    
  } catch (error) {
    console.error('Error sending admin notifications:', error)
  }
}