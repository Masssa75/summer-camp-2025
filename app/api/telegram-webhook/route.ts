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

    console.log(`Telegram message from ${userName} (ID: ${userId}):`, text)

    // If user sends /start or asks for help
    if (text === '/start' || text.toLowerCase().includes('help')) {
      const welcomeMessage = `
🏕️ <b>Summer Camp Admin Bot</b>

Hello ${userName}! 

Your Telegram ID is: <code>${userId}</code>

This bot sends notifications for new summer camp registrations. If you're an admin, please share your Telegram ID with the system administrator to receive notifications.

Commands:
• <b>/start</b> - Show this message
• <b>/id</b> - Get your Telegram ID
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