export interface ProjectTaskItem {
  id: string;
  projectId: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  assignee: string;
  dueDate: string;
  category?: string;
}

export const mockProjectTasks: ProjectTaskItem[] = [];
