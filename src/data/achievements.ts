export interface AchievementItem {
  id: string;
  title: string;
  category: 'Academic' | 'Projects' | 'Technical' | 'Competitions' | 'Certifications';
  description: string;
  date: string;
  iconName: string;
  status: 'Unlocked' | 'In Progress';
  evidenceText: string;
  relatedProjectOrCourse?: string;
}

export const mockAchievements: AchievementItem[] = [];
