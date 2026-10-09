export interface CourseResultSummary {
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  semester: number;
  totalStudents: number;
  averageMarksPercent: number;
  highestMarksPercent: number;
  lowestMarksPercent: number;
  passRatePercent: number;
  status: 'Healthy' | 'Needs Attention' | 'Critical';
}

export interface StudentResultSummary {
  studentId: string;
  studentName: string;
  usn: string;
  semester: number;
  gpa: number;
  totalCredits: number;
  courseMarks: {
    courseCode: string;
    courseName: string;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  }[];
}

export const mockCourseResults: CourseResultSummary[] = [];

export const mockStudentResults: StudentResultSummary[] = [];
