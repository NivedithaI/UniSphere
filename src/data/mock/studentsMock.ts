import type { ExtendedStudent } from '../students';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockStudentsRoster: ExtendedStudent[] = [
  {
    id: "std-1",
    name: "Jane Doe",
    usn: "1AB20CS002",
    department: "Data Science & Engineering",
    semester: 6,
    academicYear: "2026–27",
    cgpa: 8.75,
    email: "jane.doe@example.test",
    phone: "+91 98765 43210",
    attendancePercent: 88,
    assignmentsCompleted: 14,
    assignmentsTotal: 16,
    academicStatus: "Good Standing",
    coursePerformance: [
      { courseCode: "CSE-601", courseName: "Database Management Systems", grade: "A+", percentage: 92, attendance: 90 },
      { courseCode: "CSE-602", courseName: "Operating Systems", grade: "A", percentage: 85, attendance: 86 },
      { courseCode: "CSE-603", courseName: "Computer Networks", grade: "A+", percentage: 94, attendance: 92 },
      { courseCode: "MAT-604", courseName: "Applied Linear Algebra", grade: "B+", percentage: 78, attendance: 84 }
    ]
  },
  {
    id: "std-2",
    name: "Rakesh G R",
    usn: "4AI21DS001",
    department: "Data Science & Engineering",
    semester: 6,
    academicYear: "2026–27",
    cgpa: 9.12,
    email: "rakesh.gr@example.test",
    phone: "+91 98765 12345",
    attendancePercent: 94,
    assignmentsCompleted: 16,
    assignmentsTotal: 16,
    academicStatus: "Good Standing",
    coursePerformance: [
      { courseCode: "CSE-601", courseName: "Database Management Systems", grade: "S", percentage: 96, attendance: 95 },
      { courseCode: "CSE-602", courseName: "Operating Systems", grade: "A+", percentage: 91, attendance: 92 },
      { courseCode: "CSE-603", courseName: "Computer Networks", grade: "S", percentage: 95, attendance: 96 }
    ]
  }
];
