import type { TimetableEntry } from '../timetable';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockTimetableEntries: TimetableEntry[] = [
  {
    id: "tt-101",
    courseId: "cse-601",
    courseCode: "CSE-601",
    courseName: "Database Management Systems",
    facultyId: "fac-102",
    facultyName: "Dr. Rajesh Kumar",
    semester: 6,
    day: "Monday",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    room: "LH-302",
    section: "Sec A"
  }
];
