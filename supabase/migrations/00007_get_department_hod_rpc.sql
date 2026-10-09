-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00007: HOD RESOLUTION RPC FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_department_hod(p_department_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  role TEXT,
  department_id UUID,
  account_status TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, 
    full_name, 
    email, 
    role, 
    department_id, 
    account_status
  FROM public.profiles
  WHERE role = 'HOD'
    AND department_id = p_department_id
    AND account_status = 'ACTIVE'
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_department_hod(UUID) TO authenticated;
