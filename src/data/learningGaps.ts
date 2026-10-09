export interface MaterialLink {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Quiz' | 'Article';
  duration: string;
  url: string;
}

export interface TopicGapItem {
  id: string;
  courseCode: string;
  courseName: string;
  topicName: string;
  status: 'Needs Practice' | 'Needs Review' | 'Moderate' | 'Strong';
  performancePercent: number;
  recentTrend: 'Improving' | 'Stable' | 'Declining';
  suggestedFocus: string;
  materials: MaterialLink[];
  recommendedActions: string[];
}

export const mockLearningGaps: TopicGapItem[] = [];
