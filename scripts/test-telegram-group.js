#!/usr/bin/env node

/**
 * Test script for Telegram group notifications
 * 
 * Usage: node scripts/test-telegram-group.js
 * 
 * This will send a test notification to your admin group
 */

require('dotenv').config({ path: '.env.local' })

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_GROUP_ID = process.env.TELEGRAM_ADMIN_GROUP_ID

async function testGroupNotification() {
  console.log('🔍 Checking Telegram configuration...')
  
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in .env.local')
    process.exit(1)
  }
  
  if (!TELEGRAM_ADMIN_GROUP_ID) {
    console.error('❌ TELEGRAM_ADMIN_GROUP_ID not found in .env.local')
    console.log('\n📝 To get your group ID:')
    console.log('1. Create a Telegram group')
    console.log('2. Add @Bamboo_Valley_Admin_Bot to the group')
    console.log('3. Make the bot an admin')
    console.log('4. Send any message in the group')
    console.log('5. Check the logs - the group ID will be displayed')
    console.log('6. Add to .env.local: TELEGRAM_ADMIN_GROUP_ID=<your-group-id>')
    process.exit(1)
  }
  
  const groupId = parseInt(TELEGRAM_ADMIN_GROUP_ID)
  if (isNaN(groupId)) {
    console.error('❌ TELEGRAM_ADMIN_GROUP_ID must be a number, got:', TELEGRAM_ADMIN_GROUP_ID)
    process.exit(1)
  }
  
  console.log(`✅ Bot token found`)
  console.log(`✅ Admin group ID: ${groupId}`)
  
  // Test message
  const testMessage = `
🧪 <b>Test Notification</b>

This is a test message from the Summer Camp notification system.

If you can see this message, group notifications are working correctly! 🎉

<i>Timestamp: ${new Date().toLocaleString()}</i>
  `.trim()
  
  console.log('\n📤 Sending test message to group...')
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: groupId,
        text: testMessage,
        parse_mode: 'HTML'
      })
    })
    
    const result = await response.json()
    
    if (response.ok && result.ok) {
      console.log('✅ Test message sent successfully!')
      console.log('\n🎉 Group notifications are working!')
      
      // Now test the actual notification function
      console.log('\n📧 Testing registration notification format...')
      
      const { notifyAdminsOfNewRegistration } = require('../utils/telegram')
      
      const testRegistration = {
        child_name: 'Test Child',
        parent_name_1: 'Test Parent',
        email: 'test@example.com',
        age_group: 'mini',
        weeks_selected: [1, 2, 3],
        created_at: new Date().toISOString()
      }
      
      await notifyAdminsOfNewRegistration(testRegistration)
      console.log('✅ Registration notification test complete!')
      
    } else {
      console.error('❌ Failed to send message:', result)
      
      if (result.error_code === 400 && result.description?.includes('chat not found')) {
        console.error('\n⚠️  The bot might not be in the group or not have admin rights')
        console.log('Please ensure:')
        console.log('1. The bot is added to the group')
        console.log('2. The bot has admin privileges in the group')
      }
    }
  } catch (error) {
    console.error('❌ Error sending test message:', error)
  }
}

// Run the test
testGroupNotification()