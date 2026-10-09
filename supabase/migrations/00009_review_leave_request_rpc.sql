-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00009: HOD LEAVE REVIEW RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.review_leave_request(
  p_leave_id UUID,
  p_status TEXT,
  p_rejection_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID;
  v_caller_role TEXT;
  v_caller_dept_id UUID;
  v_leave RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  SELECT role, department_id INTO v_caller_role, v_caller_dept_id
  FROM public.profiles
  WHERE id = v_caller_id;

  IF v_caller_role NOT IN ('HOD', 'ADMIN') THEN
    RAISE EXCEPTION 'Only HODs or Administrators are authorized to review leave requests.';
  END IF;

  SELECT * INTO v_leave
  FROM public.leave_requests
  WHERE id = p_leave_id;

  IF v_leave IS NULL THEN
    RAISE EXCEPTION 'Leave request not found.';
  END IF;

  -- Security check: HOD can only review requests for their own department (ADMIN can review any)
  IF v_caller_role = 'HOD' AND (v_caller_dept_id IS NULL OR v_leave.department_id <> v_caller_dept_id) THEN
    RAISE EXCEPTION 'ACCESS DENIED: You are only authorized to review leave requests for your department.';
  END IF;

  IF v_leave.status <> 'PENDING' THEN
    RAISE EXCEPTION 'This leave request has already been reviewed (status: %). Only pending requests can be modified.', v_leave.status;
  END IF;

  IF p_status NOT IN ('APPROVED', 'REJECTED') THEN
    RAISE EXCEPTION 'Invalid status. Must be APPROVED or REJECTED.';
  END IF;

  IF p_status = 'REJECTED' AND (p_rejection_reason IS NULL OR TRIM(p_rejection_reason) = '') THEN
    RAISE EXCEPTION 'Rejection reason is required when rejecting a leave request.';
  END IF;

  UPDATE public.leave_requests
  SET
    status = p_status,
    reviewed_by = v_caller_id,
    reviewed_at = NOW(),
    rejection_reason = CASE WHEN p_status = 'REJECTED' THEN TRIM(p_rejection_reason) ELSE NULL END
  WHERE id = p_leave_id;

  -- Create Notification for the student
  INSERT INTO public.notifications (
    user_id,
    title,
    short_message,
    full_message,
    source,
    category,
    type,
    related_link
  ) VALUES (
    v_leave.student_id,
    CASE WHEN p_status = 'APPROVED' THEN 'Leave Request Approved' ELSE 'Leave Request Rejected' END,
    CASE 
      WHEN p_status = 'APPROVED' THEN 'Your leave request ' || COALESCE(v_leave.reference_id, '') || ' has been approved.'
      ELSE 'Your leave request ' || COALESCE(v_leave.reference_id, '') || ' has been rejected.'
    END,
    CASE 
      WHEN p_status = 'APPROVED' THEN 'Your ' || v_leave.leave_type || ' request (' || COALESCE(v_leave.reference_id, '') || ') from ' || v_leave.start_date || ' to ' || v_leave.end_date || ' has been approved by your HOD.'
      ELSE 'Your ' || v_leave.leave_type || ' request (' || COALESCE(v_leave.reference_id, '') || ') was rejected. Reason: ' || TRIM(p_rejection_reason)
    END,
    'HOD Portal',
    'Leave',
    CASE WHEN p_status = 'APPROVED' THEN 'Approval' ELSE 'Rejection' END,
    '/student/leave-requests'
  );

  RETURN jsonb_build_object(
    'success', true,
    'leave_id', p_leave_id,
    'status', p_status,
    'reviewed_by', v_caller_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.review_leave_request(UUID, TEXT, TEXT) TO authenticated;
