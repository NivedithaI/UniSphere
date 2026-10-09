import type { TodayClass, PendingWorkItem, StudentAlertItem, FacultyActivityItem } from '../facultyData';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockTodaysClasses: TodayClass[] = [
  {
    id: "cls-1",
    time: "09:00 AM – 10:00 AM",
    courseCode: "CSE-601",
    courseName: "Database Management Systems",
    department: "CSE — Data Science",
    semester: 6,
    room: "Room 302",
    status: "Completed"
  }
];

export const mockPendingWork: PendingWorkItem[] = [
  {
    id: "pw-1",
    title: "DBMS Assignment 04",
    courseName: "Database Management Systems",
    pendingCount: 18,
    type: "assignment",
    link: "/faculty/assignments/assign-dbms-04"
  }
];

export const mockStudentAlerts: StudentAlertItem[] = [
  {
    id: "alt-1",
    studentName: "Ananya Rao",
    usn: "4AI21DS008",
    type: "Low Attendance",
    details: "Attendance currently at 71% in DBMS",
    value: "71%",
    severity: "high"
  }
];

export const mockFacultyActivities: FacultyActivityItem[] = [
  {
    id: "act-1",
    timestamp: "10:30 AM",
    day: "Today",
    description: "DBMS Assignment 04 posted for CSE 6th Semester",
    category: "Assignment"
  }
];
