-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00008: LEAVE REQUESTS FK TO PROFILES
-- ============================================================

DO $$
BEGIN
  -- Drop existing constraint referencing auth.users if present
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'leave_requests_student_id_fkey'
      AND table_name = 'leave_requests'
  ) THEN
    ALTER TABLE public.leave_requests DROP CONSTRAINT leave_requests_student_id_fkey;
  END IF;

  -- Add foreign key constraint referencing public.profiles(id)
  ALTER TABLE public.leave_requests
    ADD CONSTRAINT leave_requests_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;
