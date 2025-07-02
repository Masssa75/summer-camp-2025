-- Create function to trigger webhook on new registration
CREATE OR REPLACE FUNCTION notify_telegram_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function
  PERFORM
    net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/telegram-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key')
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new registrations
DROP TRIGGER IF EXISTS on_registration_created ON public.registrations;
CREATE TRIGGER on_registration_created
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_telegram_on_registration();

-- Store admin users who can access the admin panel
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only service role can access admin_users
CREATE POLICY "Service role can manage admin users" ON public.admin_users
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);