export interface ProjectMilestoneItem {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  description: string;
  completedDate?: string;
}

export const mockProjectMilestones: ProjectMilestoneItem[] = [];
