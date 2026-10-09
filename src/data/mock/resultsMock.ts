import type { CourseResultSummary, StudentResultSummary } from '../results';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockCourseResults: CourseResultSummary[] = [
  {
    courseId: "cse-601",
    courseCode: "CSE-601",
    courseName: "Database Management Systems",
    facultyName: "Dr. Rajesh Kumar",
    semester: 6,
    totalStudents: 62,
    averageMarksPercent: 82,
    highestMarksPercent: 96,
    lowestMarksPercent: 54,
    passRatePercent: 96.8,
    status: "Healthy"
  }
];

export const mockStudentResults: StudentResultSummary[] = [
  {
    studentId: "std-1",
    studentName: "Jane Doe",
    usn: "1AB20CS002",
    semester: 6,
    gpa: 8.62,
    totalCredits: 24,
    courseMarks: []
  }
];
