-- Create admin_users table for Telegram authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id bigint UNIQUE NOT NULL,
  telegram_username text,
  first_name text,
  last_name text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Add yourself as an admin (replace with your Telegram ID)
-- To get your Telegram ID: message @userinfobot on Telegram
INSERT INTO admin_users (telegram_id, telegram_username, first_name, is_active)
VALUES (YOUR_TELEGRAM_ID, 'your_username', 'Your Name', true);

-- Create RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for reading admin users (service role only)
CREATE POLICY "Service role can manage admin users" ON admin_users
  FOR ALL USING (true);