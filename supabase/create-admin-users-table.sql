-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id bigint UNIQUE NOT NULL,
  telegram_username text,
  first_name text,
  last_name text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can manage admin users" ON public.admin_users
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert test admin user
INSERT INTO public.admin_users (telegram_id, telegram_username, first_name, is_active)
VALUES (123456789, 'testadmin', 'Test Admin', true)
ON CONFLICT (telegram_id) DO NOTHING;