import type { Course } from '../courses';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockCourses: Course[] = [
  {
    id: "cse-601",
    code: "CSE-601",
    name: "Database Management Systems",
    faculty: "Dr. Rajesh Kumar",
    progress: 72,
    attendance: 88,
    description: "Fundamental database concepts including relational database models, entity-relationship diagrams, SQL query optimization, normal forms, and transaction management.",
    nextActivity: "Module 5 — Transactions & Concurrency Control",
    semester: 6,
    modules: [
      { id: 1, title: "Introduction & Relational Database Model", completion: 100, materialsCount: 4, assignmentsCount: 1 }
    ]
  }
];
