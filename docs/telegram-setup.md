# Telegram Bot Setup Guide

## Overview
This guide will help you set up Telegram login for the admin panel and notifications for new registrations.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Start a conversation and send `/newbot`
3. Follow the prompts:
   - Choose a name for your bot (e.g., "Waldorf Phuket Admin")
   - Choose a username (must end in 'bot', e.g., "WaldorfPhuketBot")
4. Save the bot token you receive (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Enable Login Widget

1. Still in BotFather, send `/mybots`
2. Select your bot
3. Click "Bot Settings" → "Domain"
4. Add your domain: `warm-hamster-50f715.netlify.app`
   - Also add localhost for testing: `localhost:3000`

## Step 3: Get Your Chat ID

1. Start a conversation with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your chat ID in the response (it's a number like `123456789`)

## Step 4: Create Admin Group (Optional)

For team notifications:
1. Create a new Telegram group
2. Add your bot as an admin
3. Send a message in the group
4. Visit the getUpdates URL again to find the group chat ID (negative number like `-123456789`)

## Step 5: Configure Environment Variables

Add to your `.env.local` file:
```env
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=YourBotUsername
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
```

For Supabase Edge Functions, add these to Supabase dashboard:
- Go to Settings → Edge Functions
- Add the same environment variables

## Step 6: Add Admin Users

To grant admin access to specific Telegram users:

```sql
-- Add an admin user
INSERT INTO admin_users (telegram_id, telegram_username, first_name, last_name)
VALUES (123456789, 'username', 'First', 'Last');
```

## Step 7: Test the Setup

1. Go to `/admin` on your site
2. Click "Login with Telegram"
3. Authorize the bot
4. You should see the admin dashboard

5. Submit a test registration
6. Check your Telegram for the notification

## Troubleshooting

### Login not working?
- Check that the domain is added in BotFather
- Ensure `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` is correct
- Try clearing localStorage and cookies

### Notifications not sending?
- Verify the bot token is correct
- Check that the chat ID is correct (use getUpdates to verify)
- Ensure the Supabase Edge Function is deployed
- Check Supabase Edge Function logs for errors

### Bot commands for management

Send these to BotFather:
- `/setuserpic` - Set bot profile picture
- `/setdescription` - Set bot description
- `/setabouttext` - Set about text

## Security Notes

1. **Never commit bot tokens** to git
2. **Restrict admin access** by validating Telegram IDs
3. **Use environment variables** for all sensitive data
4. **Regularly rotate** bot tokens if needed

## Future Enhancements

1. **Command Menu** - Add bot commands like:
   - `/stats` - Get registration statistics
   - `/recent` - View recent registrations
   - `/export` - Export registration data

2. **Rich Notifications** - Include:
   - Registration summary cards
   - Quick action buttons
   - Weekly digests

3. **Two-way Communication**:
   - Reply to notifications to add notes
   - Quick approve/reject buttons
   - Direct messaging to parents