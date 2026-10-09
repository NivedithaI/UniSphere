import type { FacultyMember } from '../faculty';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockFacultyRoster: FacultyMember[] = [
  {
    id: "fac-1",
    employeeId: "EMP-DS-101",
    name: "Dr. Sneha Reddy",
    department: "Data Science & Engineering",
    departmentId: "dept-ds",
    designation: "Professor & HOD",
    email: "sneha.reddy@example.test",
    phone: "+91 98450 11223",
    status: "Active",
    assignedCourses: [
      { courseId: "c1", courseCode: "CSE-601", courseName: "Data Mining", semester: 6, studentCount: 62 },
      { courseId: "c2", courseCode: "CSE-603", courseName: "Machine Learning", semester: 6, studentCount: 62 }
    ],
    totalStudents: 124,
    assignmentsCreatedCount: 4,
    attendanceLogCount: 18
  },
  {
    id: "fac-2",
    employeeId: "EMP-DS-102",
    name: "Prof. Rajesh Kumar",
    department: "Data Science & Engineering",
    departmentId: "dept-ds",
    designation: "Associate Professor",
    email: "rajesh.kumar@example.test",
    phone: "+91 98450 22334",
    status: "Active",
    assignedCourses: [
      { courseId: "c3", courseCode: "CSE-602", courseName: "Big Data Systems", semester: 6, studentCount: 62 }
    ],
    totalStudents: 62,
    assignmentsCreatedCount: 2,
    attendanceLogCount: 12
  }
];
