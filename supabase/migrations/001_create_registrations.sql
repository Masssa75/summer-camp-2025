-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact info
  email TEXT NOT NULL,
  
  -- Child info
  child_name TEXT NOT NULL,
  nick_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Girl', 'Boy')),
  date_of_birth DATE NOT NULL,
  age_group TEXT NOT NULL CHECK (age_group IN ('mini', 'explorer')),
  
  -- School info
  current_school TEXT NOT NULL,
  nationality_language TEXT NOT NULL,
  english_level TEXT, -- Will store '1' through '5'
  
  -- Parents info
  parent_name_1 TEXT NOT NULL,
  parent_name_2 TEXT NOT NULL,
  mobile_phone_1 TEXT NOT NULL,
  wechat_whatsapp_1 TEXT NOT NULL,
  mobile_phone_2 TEXT NOT NULL,
  wechat_whatsapp_2 TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  
  -- Health info
  allergies TEXT NOT NULL,
  health_behavioral_conditions TEXT NOT NULL,
  has_insurance BOOLEAN NOT NULL DEFAULT false,
  
  -- Files (storing URLs from Supabase storage)
  child_passport_url TEXT,
  parent_passport_1_url TEXT,
  parent_passport_2_url TEXT,
  
  -- Camp details
  weeks_selected JSONB NOT NULL, -- Array of week numbers
  
  -- Permissions
  photo_permission BOOLEAN NOT NULL DEFAULT false,
  how_did_you_find TEXT NOT NULL,
  terms_acknowledged BOOLEAN NOT NULL DEFAULT false,
  all_statements_true BOOLEAN NOT NULL DEFAULT false,
  
  -- Payment tracking
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_amount DECIMAL(10, 2),
  payment_date TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX idx_registrations_email ON public.registrations(email);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX idx_registrations_age_group ON public.registrations(age_group);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting registrations (anyone can register)
CREATE POLICY "Anyone can create registrations" ON public.registrations
  FOR INSERT WITH CHECK (true);

-- Create policy for viewing registrations (only admins - we'll set this up later)
CREATE POLICY "Only admins can view registrations" ON public.registrations
  FOR SELECT USING (false); -- For now, no one can view. We'll update this when we add admin auth

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('registration-documents', 'registration-documents', false)
ON CONFLICT (id) DO NOTHING;