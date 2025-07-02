-- Create notifications table to store admin notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Notification content
  title varchar(255) NOT NULL,
  message text NOT NULL,
  notification_type varchar(50) DEFAULT 'registration' NOT NULL,
  
  -- Related data
  registration_id uuid REFERENCES registrations(id) ON DELETE CASCADE,
  child_name varchar(255),
  parent_email varchar(255),
  
  -- Admin who should receive this
  admin_telegram_id bigint,
  
  -- Status
  is_read boolean DEFAULT false NOT NULL,
  is_deleted boolean DEFAULT false NOT NULL,
  
  -- Constraints
  CONSTRAINT notifications_type_check CHECK (notification_type IN ('registration', 'system', 'reminder'))
);

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can manage notifications" ON public.notifications
  FOR ALL USING (auth.role() = 'service_role');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS notifications_admin_telegram_id_idx ON public.notifications(admin_telegram_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS notifications_is_deleted_idx ON public.notifications(is_deleted) WHERE is_deleted = false;