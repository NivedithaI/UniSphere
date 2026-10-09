-- ============================================================
-- AIET-UNISPHERE — MIGRATION 00004: ACADEMIC WORKFLOWS, ASSIGNMENTS & LEAVE REQUESTS
-- ============================================================

-- 1. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  marks NUMERIC NOT NULL DEFAULT 100,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Submitted', 'Graded', 'Closed')),
  resources JSONB DEFAULT '[]'::jsonb,
  rubric JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_department_id ON public.assignments(department_id);
CREATE INDEX IF NOT EXISTS idx_assignments_created_by ON public.assignments(created_by);

-- Enable RLS on assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- 2. ASSIGNMENT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Graded')),
  marks NUMERIC,
  feedback TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ,
  CONSTRAINT unique_assignment_student UNIQUE (assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- 3. LEAVE REQUESTS TABLE
CREATE SEQUENCE IF NOT EXISTS leave_ref_seq START WITH 101;

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE DEFAULT ('LV-' || LPAD(nextval('leave_ref_seq')::text, 3, '0')),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  hod_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  leave_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_student ON public.leave_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_department ON public.leave_requests(department_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_hod ON public.leave_requests(hod_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  short_message TEXT NOT NULL,
  full_message TEXT,
  source TEXT DEFAULT 'System',
  category TEXT DEFAULT 'Academic',
  type TEXT DEFAULT 'Notification',
  related_link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES FOR ASSIGNMENTS
-- ============================================================

-- Students, Faculty, HODs, Admins can read assignments for their department
CREATE POLICY "Users can read assignments for their department"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (
    department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
    OR created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Faculty and Admins can create assignments for their department
CREATE POLICY "Faculty can create assignments for their department"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (
      department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
    )
  );

-- Faculty can update their own assignments
CREATE POLICY "Faculty can update their own assignments"
  ON public.assignments FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- ============================================================
-- RLS POLICIES FOR ASSIGNMENT SUBMISSIONS
-- ============================================================

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
  ON public.assignment_submissions FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = public.assignment_submissions.assignment_id
        AND (a.created_by = auth.uid() OR a.department_id = p.department_id OR p.role = 'ADMIN')
    )
  );

-- Students can insert their own submissions
CREATE POLICY "Students can submit assignments"
  ON public.assignment_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
  );

-- Faculty can update (grade) submissions for their assignments
CREATE POLICY "Faculty can grade submissions"
  ON public.assignment_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE a.id = public.assignment_submissions.assignment_id
        AND (a.created_by = auth.uid() OR (a.department_id = p.department_id AND p.role IN ('FACULTY', 'HOD', 'ADMIN')))
    )
  );

-- ============================================================
-- RLS POLICIES FOR LEAVE REQUESTS
-- ============================================================

-- Students can read their own leave requests
-- HODs can read leave requests for their department
-- Admins can read all leave requests
CREATE POLICY "Users can read relevant leave requests"
  ON public.leave_requests FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR hod_id = auth.uid()
    OR (
      department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
      AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('HOD', 'ADMIN'))
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Students can create leave requests for their own department
CREATE POLICY "Students can create leave requests"
  ON public.leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
  );

-- HODs can update leave requests for their department (approve/reject)
CREATE POLICY "HODs can approve or reject leave requests"
  ON public.leave_requests FOR UPDATE
  TO authenticated
  USING (
    hod_id = auth.uid()
    OR (
      department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
      AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('HOD', 'ADMIN'))
    )
  );

-- ============================================================
-- RLS POLICIES FOR NOTIFICATIONS
-- ============================================================

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can send notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
