export interface FacultyProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  office: string;
  academicYear: string;
}

export interface TodayClass {
  id: string;
  time: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: number;
  room: string;
  status: 'Completed' | 'Current' | 'Upcoming';
}

export interface PendingWorkItem {
  id: string;
  title: string;
  courseName: string;
  pendingCount: number;
  type: 'assignment' | 'attendance';
  link: string;
}

export interface StudentAlertItem {
  id: string;
  studentName: string;
  usn: string;
  type: 'Low Attendance' | 'Pending Assignments' | 'Academic Attention';
  details: string;
  value: string;
  severity: 'high' | 'medium';
}

export interface FacultyActivityItem {
  id: string;
  timestamp: string;
  day: 'Today' | 'Yesterday' | 'Earlier';
  description: string;
  category: 'Assignment' | 'Attendance' | 'Evaluation' | 'System';
}

export const mockFacultyProfile: FacultyProfile = {
  id: "FAC-1023",
  name: "Dr. Sneha Reddy",
  title: "Associate Professor",
  department: "CSE — Data Science",
  email: "sneha.reddy@aiet.edu",
  office: "Academic Block B — Room 402",
  academicYear: "2026–27"
};

export const mockTodaysClasses: TodayClass[] = [];

export const mockPendingWork: PendingWorkItem[] = [];

export const mockStudentAlerts: StudentAlertItem[] = [];

export const mockFacultyActivities: FacultyActivityItem[] = [];
