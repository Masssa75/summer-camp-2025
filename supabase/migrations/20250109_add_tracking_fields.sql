-- Add tracking fields for payment and confirmation workflow
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS payment_request_sent TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS confirmation_email_sent TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cash', 'credit_card', 'promptpay', NULL)),
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS insurance_policy_url TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS imported_from TEXT CHECK (imported_from IN ('google_sheets', 'website', NULL)),
ADD COLUMN IF NOT EXISTS import_date TIMESTAMP WITH TIME ZONE;

-- Add indexes for the new tracking fields
CREATE INDEX IF NOT EXISTS idx_registrations_payment_request_sent ON public.registrations(payment_request_sent);
CREATE INDEX IF NOT EXISTS idx_registrations_confirmation_email_sent ON public.registrations(confirmation_email_sent);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON public.registrations(payment_status);

-- Update payment_status to include more states
ALTER TABLE public.registrations 
DROP CONSTRAINT IF EXISTS registrations_payment_status_check;

ALTER TABLE public.registrations
ADD CONSTRAINT registrations_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled', 'refunded'));

-- Add a registrations_history table to track changes
CREATE TABLE IF NOT EXISTS public.registrations_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Create index for history lookups
CREATE INDEX IF NOT EXISTS idx_registrations_history_registration_id ON public.registrations_history(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_history_created_at ON public.registrations_history(created_at DESC);

-- Enable RLS on history table
ALTER TABLE public.registrations_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view history (we'll update this when we have admin auth)
CREATE POLICY "Only admins can view registration history" ON public.registrations_history
  FOR SELECT USING (false);

-- Add a trigger to automatically log payment status changes
CREATE OR REPLACE FUNCTION log_registration_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
    INSERT INTO public.registrations_history (registration_id, action, details)
    VALUES (
      NEW.id,
      'payment_status_changed',
      jsonb_build_object(
        'old_status', OLD.payment_status,
        'new_status', NEW.payment_status,
        'payment_amount', NEW.payment_amount,
        'payment_date', NEW.payment_date
      )
    );
  END IF;
  
  IF OLD.payment_request_sent IS DISTINCT FROM NEW.payment_request_sent AND NEW.payment_request_sent IS NOT NULL THEN
    INSERT INTO public.registrations_history (registration_id, action, details)
    VALUES (
      NEW.id,
      'payment_request_sent',
      jsonb_build_object('sent_at', NEW.payment_request_sent)
    );
  END IF;
  
  IF OLD.confirmation_email_sent IS DISTINCT FROM NEW.confirmation_email_sent AND NEW.confirmation_email_sent IS NOT NULL THEN
    INSERT INTO public.registrations_history (registration_id, action, details)
    VALUES (
      NEW.id,
      'confirmation_email_sent',
      jsonb_build_object('sent_at', NEW.confirmation_email_sent)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS registration_changes_trigger ON public.registrations;
CREATE TRIGGER registration_changes_trigger
  AFTER UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION log_registration_changes();