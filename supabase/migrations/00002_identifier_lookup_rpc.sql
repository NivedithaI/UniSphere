-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00002: SAFE PRE-AUTH IDENTIFIER RESOLUTION
-- ============================================================

-- Function to safely resolve USN or Employee ID (e.g., ADM-001, 4AI21DS001) to account email for login.
-- Runs as SECURITY DEFINER to bypass RLS before the user has an active session.

CREATE OR REPLACE FUNCTION public.get_email_by_identifier(identifier_input TEXT)
RETURNS TABLE (email TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT email FROM public.profiles
  WHERE LOWER(TRIM(usn_or_employee_id)) = LOWER(TRIM(identifier_input))
     OR LOWER(TRIM(email)) = LOWER(TRIM(identifier_input))
  LIMIT 1;
$$;

-- Grant execution permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_email_by_identifier(TEXT) TO anon, authenticated;
