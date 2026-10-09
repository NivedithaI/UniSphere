import type { AuditLogEvent } from '../../shared/types/audit';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockAuditLogs: AuditLogEvent[] = [
  {
    id: "aud-101",
    actorUserId: "ADM-001",
    actorName: "System Administrator",
    action: "USER_CREATED",
    targetUserId: "4AI21CS012",
    targetUserName: "Student Four",
    timestamp: "2026-08-16 04:30 PM",
    metadata: "Role: STUDENT, Dept: Computer Science & Engineering, Sem: 4, Sec: A",
    status: "Success"
  }
];
