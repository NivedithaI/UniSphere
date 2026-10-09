import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, GraduationCap, Award, CalendarCheck, FileText, AlertTriangle } from 'lucide-react';
import { HODAppShell } from '../components/HODAppShell';
import { getStudentById } from '../../services/studentService';
import type { ExtendedStudent } from '../../data/students';

export const HODStudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<ExtendedStudent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const std = await getStudentById(id);
        setStudent(std);
      } catch (err) {
        console.error("Error loading student profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <HODAppShell>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--brand-dark-grey)' }}>
          Loading Student Profile...
        </div>
      </HODAppShell>
    );
  }

  if (!student) {
    return (
      <HODAppShell>
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Student Record Not Found</h2>
          <p style={{ color: 'var(--brand-dark-grey)', marginTop: '0.5rem' }}>The requested student academic profile could not be located.</p>
          <button onClick={() => navigate('/hod/students')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Student Directory
          </button>
        </div>
      </HODAppShell>
    );
  }

  return (
    <HODAppShell>
      {/* Back Link & Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/hod/students')}
          className="btn-link font-sans"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '0.75rem', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--brand-blue)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Student Directory</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-active font-mono">{student.usn}</span>
              <span className="badge badge-graded font-mono">SEMESTER {student.semester || 'N/A'}</span>
            </div>
            <h1 className="font-display" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-black)', margin: 0 }}>
              {student.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--brand-dark-grey)', marginTop: '0.2rem' }}>
              {student.department} · AY {student.academicYear || 'Not assigned'}
            </p>
          </div>

          <div>
            <span className={`badge ${student.academicStatus === 'Good Standing' ? 'badge-active' : student.academicStatus === 'Warning' ? 'badge-pending' : 'badge-overdue'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Academic Status: {student.academicStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid — Student Contact & Academic KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
        
        {/* Profile Details Panel */}
        <div className="dashboard-panel">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(156, 163, 175, 0.2)', marginBottom: '1.25rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--brand-light-grey)', border: '2px solid rgba(156, 163, 175, 0.3)', color: 'var(--brand-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-black)', margin: 0 }}>
              {student.name}
            </h2>
            <span className="font-mono text-blue font-bold" style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {student.usn}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>EMAIL ADDRESS</span>
              <div style={{ color: 'var(--brand-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <Mail size={14} />
                <span>{student.email}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>PHONE CONTACT</span>
              <div style={{ color: 'var(--brand-black)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <Phone size={14} />
                <span>{student.phone || 'Not provided'}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)', textTransform: 'uppercase' }}>SEMESTER & DEPT</span>
              <div style={{ fontWeight: 700, color: 'var(--brand-black)', marginTop: '0.15rem' }}>
                {student.semester ? `Semester ${student.semester}` : 'Semester Not provided'} — {student.department}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Performance & Course Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="dashboard-panel">
            <h2 className="panel-title font-display" style={{ marginBottom: '1rem' }}>Academic Summary & Metrics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--brand-light-grey)', padding: '1rem', borderRadius: 'var(--border-radius)', textAlign: 'center', border: '1px solid rgba(156, 163, 175, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)' }}>CUMULATIVE CGPA</span>
                <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-black)', marginTop: '0.2rem' }}>
                  {student.cgpa != null ? Number(student.cgpa).toFixed(2) : 'Not provided'}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--brand-light-grey)', padding: '1rem', borderRadius: 'var(--border-radius)', textAlign: 'center', border: '1px solid rgba(156, 163, 175, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)' }}>ATTENDANCE RATE</span>
                <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: student.attendancePercent && student.attendancePercent < 75 ? 'var(--color-error)' : 'var(--brand-black)', marginTop: '0.2rem' }}>
                  {student.attendancePercent != null ? `${student.attendancePercent}%` : 'Not provided'}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--brand-light-grey)', padding: '1rem', borderRadius: 'var(--border-radius)', textAlign: 'center', border: '1px solid rgba(156, 163, 175, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-dark-grey)' }}>ASSIGNMENTS COMPLETED</span>
                <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-black)', marginTop: '0.2rem' }}>
                  {student.assignmentsCompleted != null ? `${student.assignmentsCompleted} / ${student.assignmentsTotal || 0}` : 'Not tracked'}
                </div>
              </div>
            </div>

            {/* Course Performance Breakdown */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-black)', marginBottom: '0.75rem' }}>Course Performance Breakdown</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--brand-light-grey)', borderBottom: '1px solid rgba(156, 163, 175, 0.2)', fontWeight: 700, color: 'var(--brand-black)' }}>
                    <th style={{ padding: '0.75rem' }}>Code</th>
                    <th style={{ padding: '0.75rem' }}>Course Name</th>
                    <th style={{ padding: '0.75rem' }}>Attendance</th>
                    <th style={{ padding: '0.75rem' }}>Assignment %</th>
                    <th style={{ padding: '0.75rem' }}>Assessment Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {student.coursePerformance.map((cp) => (
                    <tr key={cp.courseCode} style={{ borderBottom: '1px solid rgba(156, 163, 175, 0.15)' }}>
                      <td style={{ padding: '0.75rem' }} className="font-mono text-blue font-bold">{cp.courseCode}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--brand-black)' }}>{cp.courseName}</td>
                      <td style={{ padding: '0.75rem' }} className="font-mono">
                        <span style={{ fontWeight: 700, color: (cp.attendance ?? 100) < 75 ? 'var(--color-error)' : 'var(--brand-black)' }}>
                          {cp.attendance != null ? `${cp.attendance}%` : 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }} className="font-mono">{cp.assignmentCompletion}%</td>
                      <td style={{ padding: '0.75rem' }} className="font-mono">{cp.assessmentAvg}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </HODAppShell>
  );
};

export default HODStudentDetail;
