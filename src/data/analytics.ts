export interface AcademicOverviewStats {
  cgpa: number;
  sgpa: number;
  attendancePercent: number;
  assignmentCompletionPercent: number;
  assessmentAveragePercent: number;
}

export interface SemesterTrendItem {
  semester: string;
  gpa: number;
  target: number;
}

export interface SubjectPerformanceItem {
  id: string;
  code: string;
  name: string;
  average: number;
  trend: 'Improving' | 'Stable' | 'Needs Attention';
  trendValue: string;
  grade: string;
}

export interface AssessmentBreakdownItem {
  name: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  trend: 'up' | 'down' | 'same';
}

export interface AssignmentCompletionData {
  submitted: number;
  pending: number;
  late: number;
  graded: number;
  completionPercentage: number;
}

export interface PerformanceInsights {
  strongestArea: {
    subject: string;
    score: number;
    details: string;
  };
  needsAttention: {
    subject: string;
    score: number;
    details: string;
  };
  improving: {
    subject: string;
    score: number;
    details: string;
  };
}

export const mockAcademicOverview: AcademicOverviewStats = {
  cgpa: 0,
  sgpa: 0,
  attendancePercent: 0,
  assignmentCompletionPercent: 0,
  assessmentAveragePercent: 0
};

export const mockSemesterTrends: SemesterTrendItem[] = [];

export const mockSubjectPerformances: SubjectPerformanceItem[] = [];

export const mockAssessmentBreakdown: AssessmentBreakdownItem[] = [];

export const mockAssignmentStats: AssignmentCompletionData = {
  submitted: 0,
  pending: 0,
  late: 0,
  graded: 0,
  completionPercentage: 0
};

export const mockPerformanceInsights: PerformanceInsights = {
  strongestArea: {
    subject: "N/A",
    score: 0,
    details: "No performance metrics recorded."
  },
  needsAttention: {
    subject: "N/A",
    score: 0,
    details: "No areas requiring attention."
  },
  improving: {
    subject: "N/A",
    score: 0,
    details: "No trend data recorded."
  }
};
