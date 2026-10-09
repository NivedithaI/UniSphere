export interface SkillEvidenceItem {
  id: string;
  title: string;
  type: 'Project' | 'Assessment' | 'Git Activity' | 'Course';
  date: string;
  description: string;
  scoreOrDetail?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Programming' | 'Web Development' | 'Database' | 'AI / ML' | 'Tools';
  level: 'Advanced' | 'Intermediate' | 'Developing';
  percent: number;
  evidenceList: SkillEvidenceItem[];
  relatedProjects: string[];
  relatedCourses: string[];
}

export interface StudentSkillProfile {
  studentName: string;
  program: string;
  department: string;
  semester: string;
  usn: string;
  cgpa: number;
  totalSkillsCount: number;
  totalVerifiedEvidence: number;
  skillCategories: {
    categoryName: 'Programming' | 'Web Development' | 'Database' | 'AI / ML' | 'Tools';
    skills: SkillItem[];
  }[];
}

export const mockSkillPassport: StudentSkillProfile = {
  studentName: '',
  program: 'B.E. Computer Science & Engineering',
  department: 'Department of CSE',
  semester: '',
  usn: '',
  cgpa: 0,
  totalSkillsCount: 0,
  totalVerifiedEvidence: 0,
  skillCategories: []
};
