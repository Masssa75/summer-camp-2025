import { NextResponse } from 'next/server'
import { sendTelegramMessage } from '@/utils/telegram'

interface TelegramUpdate {
  message?: {
    from: {
      id: number
      first_name: string
      last_name?: string
      username?: string
    }
    chat: {
      id: number
    }
    text: string
  }
}

export async function POST(request: Request) {
  try {
    const update: TelegramUpdate = await request.json()
    
    if (!update.message) {
      return NextResponse.json({ ok: true })
    }

    const { message } = update
    const userId = message.from.id
    const chatId = message.chat.id
    const text = message.text
    const userName = message.from.first_name + (message.from.last_name ? ` ${message.from.last_name}` : '')
    const isGroupChat = chatId < 0 // Group chats have negative IDs

    if (isGroupChat) {
      console.log(`📢 GROUP MESSAGE - Chat ID: ${chatId}`)
      console.log(`   From: ${userName} (User ID: ${userId})`)
      console.log(`   Message: ${text}`)
      console.log(`   ⚡ Add this to .env.local: TELEGRAM_ADMIN_GROUP_ID=${chatId}`)
    } else {
      console.log(`Telegram message from ${userName} (ID: ${userId}):`, text)
    }

    // Log this user ID for potential admin setup
    await fetch('/api/admin/add-telegram-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: userId, name: userName })
    }).catch(() => {}) // Don't fail if this doesn't work

    // If user sends /start or asks for help
    if (text === '/start' || text.toLowerCase().includes('help')) {
      const welcomeMessage = `
🏕️ <b>Welcome to Summer Camp Admin Bot!</b>

Hello ${userName}! 👋

✅ <b>Successfully connected!</b>

Your Telegram ID is: <code>${userId}</code>

🔔 <b>What happens next?</b>
• You'll receive instant notifications when new camp registrations come in
• Each notification includes child details, parent info, and a link to the admin dashboard
• Your admin status will show as "connected" in the dashboard

💡 <b>Available Commands:</b>
• <b>/start</b> - Show this welcome message
• <b>/id</b> - Get your Telegram ID
• <b>/help</b> - Show help information

🎯 <b>Ready to receive notifications!</b>
Try submitting a test registration to see how it works.
      `.trim()

      await sendTelegramMessage(chatId, welcomeMessage)
    }
    // If user asks for their ID
    else if (text === '/id' || text.toLowerCase().includes('my id')) {
      await sendTelegramMessage(chatId, `Your Telegram ID is: <code>${userId}</code>`)
    }
    // For any other message, respond with help
    else {
      await sendTelegramMessage(
        chatId, 
        `Hi ${userName}! Your Telegram ID is <code>${userId}</code>. Send /help for available commands.`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ ok: true }) // Always return ok to Telegram
  }
}