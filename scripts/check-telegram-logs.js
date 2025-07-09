#!/usr/bin/env node

/**
 * Check recent Telegram webhook logs to find group ID
 */

console.log(`
📢 To get your group ID:

1. Send a message in your private admin group
2. Check the Netlify function logs:
   
   🔗 https://app.netlify.com/sites/warm-hamster-50f715/functions/telegram-webhook

3. Look for a log entry like:
   📢 GROUP MESSAGE - Chat ID: -1001234567890
   
4. Copy that negative number (it's your group ID)

5. Add to .env.local:
   TELEGRAM_ADMIN_GROUP_ID=-1001234567890

Note: Group IDs are negative numbers (like -1001234567890)
      Personal chat IDs are positive (like 5089502326)
`)