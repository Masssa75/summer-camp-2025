#!/usr/bin/env node

/**
 * Test script for Telegram personal notifications
 * 
 * Usage: node scripts/test-telegram-personal.js
 */

require('dotenv').config({ path: '.env.local' })

async function testPersonalNotification() {
  console.log('🔍 Testing Telegram notification to Marc...')
  
  const { notifyAdminsOfNewRegistration } = require('../utils/telegram')
  
  const testRegistration = {
    child_name: 'Test Child',
    parent_name_1: 'Test Parent',
    email: 'test@example.com',
    age_group: 'mini',
    weeks_selected: [1, 2, 3],
    created_at: new Date().toISOString()
  }
  
  console.log('📤 Sending test registration notification...')
  
  try {
    await notifyAdminsOfNewRegistration(testRegistration)
    console.log('✅ Test complete! Check your Telegram for the notification.')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the test
testPersonalNotification()