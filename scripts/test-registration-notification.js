#!/usr/bin/env node

/**
 * Test registration notification to Telegram group
 */

require('dotenv').config({ path: '.env.local' })

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_GROUP_ID = process.env.TELEGRAM_ADMIN_GROUP_ID

async function testRegistrationNotification() {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_GROUP_ID) {
    console.error('Missing required environment variables')
    return
  }
  
  const groupId = parseInt(TELEGRAM_ADMIN_GROUP_ID)
  
  // Simulate a real registration
  const registrationMessage = `
🏕️ <b>New Summer Camp Registration!</b>

👶 <b>Child:</b> Emma Thompson
👨‍👩‍👧‍👦 <b>Parent:</b> Sarah Thompson
📧 <b>Email:</b> sarah.thompson@example.com
🎯 <b>Camp:</b> Mini Camp (3-6)
📅 <b>Weeks:</b> 1, 2, 3
🕐 <b>Registered:</b> ${new Date().toLocaleString()}

🔗 <a href="https://phuketsummercamp.com/admin">View in Admin Dashboard</a>
  `.trim()
  
  console.log('📤 Sending registration notification to group...')
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: groupId,
        text: registrationMessage,
        parse_mode: 'HTML'
      })
    })
    
    const result = await response.json()
    
    if (response.ok && result.ok) {
      console.log('✅ Registration notification sent to group!')
      console.log('\n🎉 Your Telegram notifications are now working!')
      console.log('\nNext steps:')
      console.log('1. Add TELEGRAM_ADMIN_GROUP_ID=-1002582721018 to Netlify environment variables')
      console.log('2. New registrations will automatically notify your admin group')
    } else {
      console.error('❌ Failed:', result)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testRegistrationNotification()