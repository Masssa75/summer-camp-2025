-- Create parents table (unique parents)
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique identifiers (for deduplication)
  email TEXT UNIQUE NOT NULL,
  phone_primary TEXT,
  
  -- Parent info
  full_name TEXT NOT NULL,
  phone_secondary TEXT,
  wechat_whatsapp TEXT,
  
  -- Additional info
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp', 'wechat')),
  notes TEXT
);

-- Create students table (unique children)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic info
  full_name TEXT NOT NULL,
  nick_name TEXT,
  chinese_name TEXT,
  gender TEXT CHECK (gender IN ('Girl', 'Boy')),
  date_of_birth DATE NOT NULL,
  
  -- Unique constraint to prevent duplicates
  CONSTRAINT unique_student UNIQUE (full_name, date_of_birth),
  
  -- School info
  current_school TEXT,
  grade_level TEXT,
  nationality TEXT,
  languages_spoken TEXT[],
  english_level TEXT,
  
  -- Health info
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  dietary_restrictions TEXT,
  special_needs TEXT,
  
  -- Emergency info
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Documents
  photo_url TEXT,
  passport_url TEXT,
  insurance_policy_url TEXT,
  medical_form_url TEXT,
  
  -- Permissions
  photo_permission BOOLEAN DEFAULT false,
  swimming_permission BOOLEAN DEFAULT false,
  field_trip_permission BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- Create parent_student junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.parent_student (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent' CHECK (relationship IN ('parent', 'guardian', 'emergency_contact')),
  is_primary BOOLEAN DEFAULT false,
  
  CONSTRAINT unique_parent_student UNIQUE (parent_id, student_id)
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic info
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  
  -- Employment info
  role TEXT NOT NULL CHECK (role IN ('teacher', 'assistant', 'coordinator', 'admin', 'nurse', 'driver')),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  -- Qualifications
  certifications TEXT[],
  languages_spoken TEXT[],
  
  -- Emergency contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Documents
  photo_url TEXT,
  resume_url TEXT,
  contract_url TEXT,
  background_check_url TEXT
);

-- Create camp_sessions table (replaces hardcoded weeks)
CREATE TABLE IF NOT EXISTS public.camp_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session info
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  session_name TEXT, -- e.g., "Week 1 - Ocean Adventure"
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Capacity
  mini_camp_capacity INTEGER DEFAULT 20,
  explorer_camp_capacity INTEGER DEFAULT 30,
  
  -- Pricing
  mini_camp_price DECIMAL(10, 2),
  explorer_camp_price DECIMAL(10, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  registration_open BOOLEAN DEFAULT true,
  
  CONSTRAINT unique_session UNIQUE (year, week_number)
);

-- Create enrollments table (links students to sessions)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Links
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.camp_sessions(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.registrations(id), -- Link to original registration
  
  -- Enrollment details
  camp_type TEXT NOT NULL CHECK (camp_type IN ('mini', 'explorer')),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'waitlist', 'cancelled', 'completed')),
  
  -- Payment tracking
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  payment_amount DECIMAL(10, 2),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Transportation
  needs_transportation BOOLEAN DEFAULT false,
  pickup_location TEXT,
  dropoff_location TEXT,
  
  -- Notes
  special_instructions TEXT,
  admin_notes TEXT,
  
  CONSTRAINT unique_enrollment UNIQUE (student_id, session_id)
);

-- Create attendance table (daily tracking)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Links
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Attendance
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'early_pickup', 'sick')),
  check_in_time TIME,
  check_out_time TIME,
  
  -- Details
  checked_in_by UUID REFERENCES public.staff(id),
  checked_out_by UUID REFERENCES public.staff(id),
  notes TEXT,
  
  CONSTRAINT unique_attendance UNIQUE (enrollment_id, date)
);

-- Create staff_assignments table (which staff work which sessions)
CREATE TABLE IF NOT EXISTS public.staff_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.camp_sessions(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL,
  camp_type TEXT CHECK (camp_type IN ('mini', 'explorer', 'both')),
  is_lead BOOLEAN DEFAULT false,
  
  CONSTRAINT unique_assignment UNIQUE (staff_id, session_id)
);

-- Create indexes for performance
CREATE INDEX idx_parents_email ON public.parents(email);
CREATE INDEX idx_students_name ON public.students(full_name);
CREATE INDEX idx_students_dob ON public.students(date_of_birth);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_session ON public.enrollments(session_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_attendance_enrollment ON public.attendance(enrollment_id);

-- Enable RLS on all tables
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;

-- Create view for easy querying of student enrollments with parent info
CREATE OR REPLACE VIEW public.student_enrollment_view AS
SELECT 
  s.id as student_id,
  s.full_name as student_name,
  s.nick_name,
  s.date_of_birth,
  s.gender,
  p.full_name as parent_name,
  p.email as parent_email,
  p.phone_primary as parent_phone,
  cs.year,
  cs.week_number,
  cs.session_name,
  e.camp_type,
  e.status as enrollment_status,
  e.payment_status,
  e.payment_amount
FROM public.students s
JOIN public.parent_student ps ON s.id = ps.student_id
JOIN public.parents p ON ps.parent_id = p.id
JOIN public.enrollments e ON s.id = e.student_id
JOIN public.camp_sessions cs ON e.session_id = cs.id
WHERE ps.is_primary = true;

-- Function to deduplicate and create parent from registration
CREATE OR REPLACE FUNCTION create_or_get_parent(
  p_email TEXT,
  p_name TEXT,
  p_phone TEXT DEFAULT NULL,
  p_wechat_whatsapp TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_parent_id UUID;
BEGIN
  -- Try to find existing parent by email
  SELECT id INTO v_parent_id
  FROM public.parents
  WHERE email = p_email;
  
  -- If not found, create new parent
  IF v_parent_id IS NULL THEN
    INSERT INTO public.parents (email, full_name, phone_primary, wechat_whatsapp)
    VALUES (p_email, p_name, p_phone, p_wechat_whatsapp)
    RETURNING id INTO v_parent_id;
  END IF;
  
  RETURN v_parent_id;
END;
$$ LANGUAGE plpgsql;

-- Function to deduplicate and create student from registration
CREATE OR REPLACE FUNCTION create_or_get_student(
  p_full_name TEXT,
  p_date_of_birth DATE,
  p_gender TEXT DEFAULT NULL,
  p_nick_name TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_student_id UUID;
BEGIN
  -- Try to find existing student by name and DOB
  SELECT id INTO v_student_id
  FROM public.students
  WHERE full_name = p_full_name
  AND date_of_birth = p_date_of_birth;
  
  -- If not found, create new student
  IF v_student_id IS NULL THEN
    INSERT INTO public.students (full_name, date_of_birth, gender, nick_name)
    VALUES (p_full_name, p_date_of_birth, p_gender, p_nick_name)
    RETURNING id INTO v_student_id;
  END IF;
  
  RETURN v_student_id;
END;
$$ LANGUAGE plpgsql;