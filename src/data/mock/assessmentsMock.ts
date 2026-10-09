import type { Assessment } from '../assessments';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockAssessments: Assessment[] = [
  {
    id: "assess-dbms-ut2",
    title: "Database Systems — Unit Test 2",
    courseId: "cse-601",
    courseName: "Database Management Systems",
    date: "2026-08-18",
    time: "10:00 AM",
    duration: 60,
    status: "Upcoming",
    questionsCount: 20,
    instructions: "This test covers Normalization (1NF, 2NF, 3NF, BCNF) and Transaction properties."
  }
];
