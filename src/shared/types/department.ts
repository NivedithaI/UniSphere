export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  hodName: string;
  hodEmail: string;
  facultyCount: number;
  studentCount: number;
  sections: {
    semester: number;
    section: string;
    studentCount: number;
  }[];
  status: 'Active' | 'Inactive';
}
