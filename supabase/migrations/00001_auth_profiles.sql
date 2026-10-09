-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00001: AUTH & PROFILES FOUNDATION
-- ============================================================

-- 1. Create enum/check types for Role and Account Status if needed
-- We use canonical uppercase roles: 'STUDENT', 'FACULTY', 'HOD', 'ADMIN'
-- We use canonical account statuses: 'ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING'

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  usn_or_employee_id TEXT,
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'FACULTY', 'HOD', 'ADMIN')),
  account_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user & role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_usn_emp ON public.profiles(usn_or_employee_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. RLS POLICIES

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN' AND account_status = 'ACTIVE'
    )
  );

-- Policy: Users can update their own basic profile info (excluding role & account_status)
CREATE POLICY "Users can update own basic profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent self-elevating role or altering account_status from client
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND account_status = (SELECT account_status FROM public.profiles WHERE id = auth.uid())
  );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ADMIN' AND account_status = 'ACTIVE'
    )
  );

-- 3. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  -- Security: Public signup defaults strictly to 'STUDENT'
  -- Non-student roles (FACULTY, HOD, ADMIN) must be provisioned by Admin
  assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT');
  IF assigned_role NOT IN ('STUDENT', 'FACULTY', 'HOD', 'ADMIN') THEN
    assigned_role := 'STUDENT';
  END IF;

  -- Prevent public signup from assigning ADMIN role
  IF assigned_role = 'ADMIN' THEN
    assigned_role := 'STUDENT';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    usn_or_employee_id,
    role,
    account_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'usn_or_employee_id', NEW.raw_user_meta_data->>'usn', ''),
    assigned_role,
    'ACTIVE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
