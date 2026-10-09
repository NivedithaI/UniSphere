import type { AttendanceSummary } from '../attendance';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockAttendance: AttendanceSummary = {
  overallPercentage: 82,
  subjects: [
    { subject: "Database Management Systems", code: "CSE-601", held: 40, attended: 35, percentage: 88, status: "Good" }
  ],
  trend: [
    { month: "Jan", percentage: 85 }
  ],
  history: [
    { date: "2026-08-14", subject: "Database Management Systems", code: "CSE-601", status: "Present", faculty: "Dr. Rajesh Kumar", session: "09:00 AM - 10:00 AM" }
  ]
};
