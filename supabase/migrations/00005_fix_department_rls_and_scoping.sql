-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00005: DEPARTMENT RLS SCOPING FOR FACULTY & HOD
-- ============================================================

-- Allow Faculty and HOD to view student profiles belonging to their department
DROP POLICY IF EXISTS "Faculty and HOD can view department student profiles" ON public.profiles;

CREATE POLICY "Faculty and HOD can view department student profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    role = 'STUDENT'
    AND department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('FACULTY', 'HOD') AND account_status = 'ACTIVE'
    )
  );
