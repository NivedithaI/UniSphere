export interface CourseModule {
  id: number;
  title: string;
  completion: number; // percentage
  materialsCount: number;
  assignmentsCount: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  faculty: string;
  progress: number;
  attendance: number;
  description: string;
  nextActivity: string;
  semester: number;
  modules: CourseModule[];
}

export const mockCourses: Course[] = [];
