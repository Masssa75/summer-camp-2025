#!/usr/bin/env node

/**
 * Direct test script for Telegram notifications
 */

require('dotenv').config({ path: '.env.local' })

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_IDS = process.env.TELEGRAM_ADMIN_IDS

async function sendTelegramMessage(chatId, message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    })
  })
  
  return response.json()
}

async function testNotification() {
  console.log('🔍 Checking configuration...')
  console.log('Bot token:', TELEGRAM_BOT_TOKEN ? '✅ Found' : '❌ Missing')
  console.log('Admin IDs:', TELEGRAM_ADMIN_IDS || '❌ Missing')
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_IDS) {
    console.error('Missing required environment variables')
    return
  }
  
  const adminIds = TELEGRAM_ADMIN_IDS.split(',').map(id => parseInt(id.trim()))
  console.log('Sending to:', adminIds)
  
  const testMessage = `
🏕️ <b>New Summer Camp Registration!</b>

👶 <b>Child:</b> Test Child
👨‍👩‍👧‍👦 <b>Parent:</b> Test Parent
📧 <b>Email:</b> test@example.com
🎯 <b>Camp:</b> Mini Camp (3-6)
📅 <b>Weeks:</b> 1, 2, 3
🕐 <b>Registered:</b> ${new Date().toLocaleString()}

🔗 <a href="https://phuketsummercamp.com/admin">View in Admin Dashboard</a>
  `.trim()
  
  for (const adminId of adminIds) {
    console.log(`\n📤 Sending to ${adminId}...`)
    try {
      const result = await sendTelegramMessage(adminId, testMessage)
      if (result.ok) {
        console.log('✅ Message sent successfully!')
      } else {
        console.error('❌ Failed:', result)
      }
    } catch (error) {
      console.error('❌ Error:', error)
    }
  }
}

testNotification()