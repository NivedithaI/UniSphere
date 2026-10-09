-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00003: DEPARTMENTS & PROFILE RELATIONSHIP
-- ============================================================

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_departments_status ON public.departments(status);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Everyone (anon & authenticated) can read active departments for form dropdowns & identity display
CREATE POLICY "Allow public read access to departments"
  ON public.departments FOR SELECT
  USING (true);

-- Admins can insert/update/delete departments
CREATE POLICY "Admins can manage departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN' AND account_status = 'ACTIVE'
    )
  );

-- Add department_id column to public.profiles if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.profiles 
      ADD COLUMN department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index on department_id in profiles
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON public.profiles(department_id);

-- Seed initial standard departments if table is empty
INSERT INTO public.departments (name, code, status)
SELECT 'Computer Science & Engineering', 'CSE', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'CSE');

INSERT INTO public.departments (name, code, status)
SELECT 'CSE – Data Science', 'CSE-DS', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'CSE-DS');

INSERT INTO public.departments (name, code, status)
SELECT 'Information Science & Engineering', 'ISE', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'ISE');

INSERT INTO public.departments (name, code, status)
SELECT 'Electronics & Communication Engineering', 'ECE', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'ECE');

INSERT INTO public.departments (name, code, status)
SELECT 'Electrical & Electronics Engineering', 'EEE', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'EEE');

INSERT INTO public.departments (name, code, status)
SELECT 'Mechanical Engineering', 'MECH', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'MECH');

INSERT INTO public.departments (name, code, status)
SELECT 'Artificial Intelligence & Machine Learning', 'AIML', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.departments WHERE code = 'AIML');
