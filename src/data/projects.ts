export type ProjectType = 'Course Project' | 'Capstone' | 'Research' | 'Personal';
export type ProjectCategory = 'Assigned Projects' | 'My Projects' | 'Team Projects' | 'Completed Projects';
export type ProjectStatus = 'Active' | 'Completed' | 'Pending Review' | 'Upcoming';

export interface ProjectTeamMember {
  name: string;
  role: string;
  contribution: string;
  avatar?: string;
  isOwner?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  course: string;
  projectType: ProjectType;
  category: ProjectCategory;
  faculty: string;
  team: ProjectTeamMember[];
  progress: number;
  currentMilestone: string;
  deadline: string;
  status: ProjectStatus;
  technology: string[];
  repository: string;
  lastUpdated: string;
  owner: string;
  startDate: string;
  requirementsCount: {
    total: number;
    completed: number;
  };
}

export const mockProjects: ProjectItem[] = [];
