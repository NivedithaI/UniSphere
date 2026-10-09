import type { NotificationItem } from '../notifications';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'Assignment',
    category: 'Academic',
    title: 'DBMS Assignment 04 Due Tomorrow',
    shortMessage: 'DBMS Assignment 04 is due tomorrow at 11:59 PM.',
    fullMessage: 'Your assignment is scheduled for submission by tomorrow.',
    time: '2 hours ago',
    timestamp: '2026-08-17T07:14:00Z',
    isRead: false,
    priority: 'high',
    source: 'Academic Department'
  }
];
