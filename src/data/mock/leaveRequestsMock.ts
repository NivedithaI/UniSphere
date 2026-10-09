import type { LeaveRequest } from '../leaveRequests';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LV-089",
    requesterId: "std-1",
    requesterName: "Jane Doe",
    requesterUsnOrEmpId: "1AB20CS002",
    requesterRole: "STUDENT",
    departmentId: "dept-ds",
    leaveType: "Duty Leave",
    startDate: "2026-08-14",
    endDate: "2026-08-16",
    days: 3,
    reason: "Participation in AIET Campus Tech Fest hackathon final round.",
    status: "Approved",
    submittedAt: "2026-08-12 10:30 AM"
  }
];
