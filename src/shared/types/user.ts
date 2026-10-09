export type UserRole = 'STUDENT' | 'FACULTY' | 'HOD' | 'ADMIN';
export type AccountStatus = 'Active' | 'Inactive' | 'Locked' | 'Pending';

export interface User {
  id: string;
  userId: string; // USN for Student (e.g., 4AI21DS001), Employee ID for Faculty/HOD (EMP-DS-01), Admin ID for Admin (ADM-001)
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  semester?: number; // Only for Students
  section?: string;  // Only for Students (Sec A, Sec B)
  designation?: string; // For Faculty/HOD (Professor & HOD, Associate Professor, System Administrator)
  status: AccountStatus;
  lastActivity: string;
  lastLogin?: string;
  failedLoginAttempts?: number;
  passwordStatus?: 'Set' | 'Temporary' | 'Reset Required';
  lastPasswordReset?: string;
  createdAt: string;
}
