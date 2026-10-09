-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00006: STUDENT PROFILES & DEPARTMENT SCOPING RLS
-- ============================================================

-- 1. Create table for extended Student Profile details
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  semester INT,
  academic_year TEXT,
  cgpa NUMERIC,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast student profile lookups
CREATE INDEX IF NOT EXISTS idx_student_profiles_profile_id ON public.student_profiles(profile_id);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- 2. SECURITY DEFINER HELPER FUNCTIONS (Prevents 42P17 Infinite Recursion)
CREATE OR REPLACE FUNCTION public.get_auth_user_department_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT department_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. RLS POLICIES FOR STUDENT PROFILES
DROP POLICY IF EXISTS "Users can read relevant student profiles" ON public.student_profiles;
CREATE POLICY "Users can read relevant student profiles"
  ON public.student_profiles FOR SELECT
  TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = public.student_profiles.profile_id
        AND p.department_id = public.get_auth_user_department_id()
        AND public.get_auth_user_role() IN ('FACULTY', 'HOD', 'ADMIN')
    )
    OR public.get_auth_user_role() = 'ADMIN'
  );

DROP POLICY IF EXISTS "Students can insert own student profile" ON public.student_profiles;
CREATE POLICY "Students can insert own student profile"
  ON public.student_profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Students can update own student profile" ON public.student_profiles;
CREATE POLICY "Students can update own student profile"
  ON public.student_profiles FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 4. UPDATE PROFILES RLS: ALLOW USERS TO VIEW PROFILES IN THE SAME DEPARTMENT
-- This allows students to locate active HOD for leave requests, HODs to view department faculty, etc.
DROP POLICY IF EXISTS "Users can view profiles in same department" ON public.profiles;
CREATE POLICY "Users can view profiles in same department"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    department_id IS NOT NULL 
    AND department_id = public.get_auth_user_department_id()
  );
