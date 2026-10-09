export interface TimetableEntry {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  semester: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
  section: string;
  hasConflict?: boolean;
  conflictReason?: string;
}

export const mockTimetableEntries: TimetableEntry[] = [];
