import type { User } from '../../shared/types/user';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockUsersList: User[] = [
  {
    id: "usr-001",
    userId: "EMP-DS-101",
    name: "Dr. Sneha Reddy",
    email: "sneha.reddy@example.test",
    role: "HOD",
    departmentId: "dept-ds",
    departmentName: "Data Science & Engineering",
    designation: "Professor & HOD",
    status: "Active",
    createdAt: "2024-01-15",
    lastActivity: "10 mins ago",
    passwordStatus: "Set"
  },
  {
    id: "usr-002",
    userId: "1AB20CS002",
    name: "Jane Doe",
    email: "jane.doe@example.test",
    role: "STUDENT",
    departmentId: "dept-ds",
    departmentName: "Data Science & Engineering",
    semester: 6,
    status: "Active",
    createdAt: "2024-02-01",
    lastActivity: "2 hours ago",
    passwordStatus: "Set"
  },
  {
    id: "usr-003",
    userId: "EMP-DS-102",
    name: "Prof. Rajesh Kumar",
    email: "rajesh.kumar@example.test",
    role: "FACULTY",
    departmentId: "dept-ds",
    departmentName: "Data Science & Engineering",
    designation: "Associate Professor",
    status: "Active",
    createdAt: "2024-01-20",
    lastActivity: "Yesterday",
    passwordStatus: "Set"
  },
  {
    id: "usr-004",
    userId: "ADM-001",
    name: "System Administrator",
    email: "admin@example.test",
    role: "ADMIN",
    departmentId: "dept-admin",
    departmentName: "Central Administration",
    designation: "Chief Administrator",
    status: "Active",
    createdAt: "2024-01-01",
    lastActivity: "Just now",
    passwordStatus: "Set"
  }
];
