import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, BookOpen, CalendarCheck, ClipboardList, Award, Mail, Phone } from 'lucide-react';
import { FacultyAppShell } from '../components/FacultyAppShell';
import { getStudentById } from '../../services/studentService';
import type { ExtendedStudent } from '../../data/students';
import { StatCard } from '../../components/StatCard';

export const FacultyStudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<ExtendedStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentById(id || 'std-1').then((res) => {
      setStudent(res);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading || !student) {
    return (
      <FacultyAppShell>
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--brand-dark-grey)', fontWeight: 500 }}>
          Loading student profile...
        </div>
      </FacultyAppShell>
    );
  }

  return (
    <FacultyAppShell>
      {/* Back Button & Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          className="btn btn-secondary" 
          style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginBottom: '1rem' }}
          onClick={() => navigate('/faculty/students')}
        >
          <ArrowLeft size={14} />
          <span>Back to Students</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-graded">{student.department}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--brand-dark-grey)', fontWeight: 500 }}>
                {student.semester ? `Semester ${student.semester}` : 'Semester Not provided'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--brand-black)' }}>{student.name}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--brand-dark-grey)', fontWeight: 500, marginTop: '0.1rem' }}>
              USN: <span style={{ fontFamily: 'monospace' }}>{student.usn}</span> · Academic Year {student.academicYear || 'Not assigned'}
            </p>
          </div>

          <span className={`badge ${
            student.academicStatus === 'Good Standing' ? 'badge-graded' :
            student.academicStatus === 'Warning' ? 'badge-overdue' : 'badge-pending'
          }`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
            {student.academicStatus}
          </span>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="stat-cards-grid">
        <StatCard 
          title="Overall CGPA" 
          value={student.cgpa != null ? Number(student.cgpa).toFixed(2) : "Not provided"} 
          icon={<Award size={20} />}
        />
        <StatCard 
          title="Overall Attendance" 
          value={student.attendancePercent != null ? `${student.attendancePercent}%` : "Not provided"} 
          icon={<CalendarCheck size={20} />}
        />
        <StatCard 
          title="Assignments Done" 
          value={student.assignmentsCompleted != null ? `${student.assignmentsCompleted} / ${student.assignmentsTotal || 0}` : "Not tracked"} 
          icon={<ClipboardList size={20} />}
        />
      </div>

      {/* Profile & Contact Details */}
      <div className="dashboard-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <h3 className="panel-title" style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Student Profile Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-dark-grey)', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-black)' }}>{student.name}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-dark-grey)', fontWeight: 600, textTransform: 'uppercase' }}>USN</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-black)', fontFamily: 'monospace' }}>{student.usn}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-dark-grey)', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</span>
            <span style={{ fontWeight: 500, color: 'var(--brand-black)' }}>{student.email}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-dark-grey)', fontWeight: 600, textTransform: 'uppercase' }}>Phone</span>
            <span style={{ fontWeight: 500, color: 'var(--brand-black)', fontFamily: 'monospace' }}>{student.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Course Performance Breakdown Table */}
      <div className="dashboard-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
          <h3 className="panel-title" style={{ fontSize: '1.05rem' }}>Enrolled Course Performance</h3>
        </div>
        <div className="table-responsive">
          <table className="table font-sans">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Attendance Rate</th>
                <th>Assignment Completion</th>
                <th>Assessment Average</th>
              </tr>
            </thead>
            <tbody>
              {student.coursePerformance.map((cp, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>{cp.courseCode}</td>
                  <td style={{ fontWeight: 600, color: 'var(--brand-black)' }}>{cp.courseName}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: (cp.attendance ?? 100) < 75 ? 'var(--color-error)' : 'var(--brand-blue)' }}>
                      {cp.attendance != null ? `${cp.attendance}%` : 'N/A'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{cp.assignmentCompletion}%</td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace' }}>{cp.assessmentAvg}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FacultyAppShell>
  );
};

export default FacultyStudentDetail;
