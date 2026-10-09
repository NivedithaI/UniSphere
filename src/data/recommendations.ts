export interface RecommendationItem {
  id: string;
  title: string;
  reason: string;
  courseCode: string;
  courseName: string;
  category: 'Courses' | 'Topics' | 'Practice' | 'Assessments' | 'Materials';
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
  targetRoute: string;
}

export const mockRecommendations: RecommendationItem[] = [];
