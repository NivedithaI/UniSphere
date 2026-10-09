import type { Assignment } from '../assignments';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockAssignments: Assignment[] = [
  {
    id: "assign-dbms-04",
    title: "DBMS Assignment 04 — Indexing and SQL Query Optimization",
    courseId: "cse-601",
    courseName: "Database Management Systems",
    deadline: "2026-08-17T18:00:00",
    marks: 20,
    status: "Pending",
    instructions: "Write optimized SQL queries for the provided schema. Analyze query execution plans using EXPLAIN ANALYZE.",
    resources: ["DBMS_Assignment_Schema_Specs.pdf"],
    rubric: ["SQL Correctness (5 Marks)"]
  }
];
