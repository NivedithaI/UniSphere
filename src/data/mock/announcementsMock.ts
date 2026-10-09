import type { Announcement } from '../announcements';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockAnnouncements: Announcement[] = [
  {
    id: "anc-201",
    title: "AIET Hackathon 2026 Registration Open",
    content: "Registrations are open for the annual AIET Hackathon. Form teams of 4 members and register before August 25.",
    category: "Event",
    departmentId: "dept-ds",
    departmentName: "Data Science & Engineering",
    createdBy: "Dr. Sneha Reddy",
    authorRole: "HOD",
    targetAudience: "Students + Faculty",
    publishedAt: "2026-08-14 09:30 AM",
    status: "Published"
  }
];
