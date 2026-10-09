import type { ProjectItem } from '../projects';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Smart Campus Analytics',
    description: 'Real-time Internet of Things sensor data pipeline.',
    course: 'Data Analytics (CS-601)',
    projectType: 'Course Project',
    category: 'Assigned Projects',
    faculty: 'Dr. Faculty Name',
    team: [
      { name: 'Jane Doe', role: 'Frontend & UI Lead', contribution: 'React Dashboard', isOwner: true }
    ],
    progress: 68,
    currentMilestone: 'API Integration',
    deadline: '28 Aug 2026',
    status: 'Active',
    technology: ['React', 'TypeScript'],
    repository: 'ai-campus-analytics',
    lastUpdated: '2 hours ago',
    owner: 'Jane Doe',
    startDate: '01 Jul 2026',
    requirementsCount: { total: 10, completed: 7 }
  }
];
