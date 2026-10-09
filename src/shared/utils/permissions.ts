import type { User, UserRole } from '../types/user';

export type Permission = 
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.deactivate'
  | 'users.role_change'
  | 'users.department_assign'
  | 'users.section_assign'
  | 'security.view'
  | 'security.manage'
  | 'department.view'
  | 'department.manage';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'users.view',
    'users.create',
    'users.edit',
    'users.deactivate',
    'users.role_change',
    'users.department_assign',
    'users.section_assign',
    'security.view',
    'security.manage',
    'department.view',
    'department.manage'
  ],
  HOD: [
    'users.view',
    'department.view'
  ],
  FACULTY: [
    'users.view'
  ],
  STUDENT: []
};

export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role;
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
};

export const canManageUsers = (user: User | null): boolean => {
  return hasPermission(user, 'users.create') && hasPermission(user, 'users.deactivate');
};

export const canChangeRole = (user: User | null): boolean => {
  return hasPermission(user, 'users.role_change');
};

export const canManageSecurity = (user: User | null): boolean => {
  return hasPermission(user, 'security.manage');
};
