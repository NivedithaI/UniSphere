export type AuditAction = 
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'ROLE_CHANGED'
  | 'DEPARTMENT_CHANGED'
  | 'SECTION_CHANGED'
  | 'ACCOUNT_DEACTIVATED'
  | 'ACCOUNT_REACTIVATED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'FORCE_PASSWORD_RESET'
  | 'TEMPORARY_CREDENTIAL_GENERATED';

export interface AuditLogEvent {
  id: string;
  actorUserId: string;
  actorName: string;
  action: AuditAction;
  targetUserId: string;
  targetUserName: string;
  timestamp: string;
  metadata?: string;
  status: 'Success' | 'Failed';
}
