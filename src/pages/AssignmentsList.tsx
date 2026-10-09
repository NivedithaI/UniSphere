import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { getAssignments } from '../services/assignmentService';
import { AppShell } from '../components/AppShell';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export const AssignmentsList: React.FC = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'overdue'>('all');

  const fetchAssignmentsList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      setError("Unable to load assignments list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentsList();
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <LoadingState message="Loading your assignments..." />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <ErrorState message={error} onRetry={fetchAssignmentsList} />
      </AppShell>
    );
  }

  // Filter logic
  const filteredAssignments = assignments.filter((assign) => {
    if (activeTab === 'all') return true;
    return assign.status.toLowerCase() === activeTab;
  });

  const getTabLabel = (tabId: string, count: number) => {
    const capitalized = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    return `${capitalized} (${count})`;
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="page-header-container">
        <div style={{ textAlign: 'left' }}>
          <div className="breadcrumbs">
            <span>Academics</span>
            <span className="breadcrumbs-separator">/</span>
            <span style={{ fontWeight: 600, color: 'var(--brand-black)' }}>Assignments</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Assignments</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--brand-dark-grey)', marginTop: '0.125rem' }}>
            Submit and review your homework assignments.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-navigation">
        <button onClick={() => setActiveTab('all')} className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}>
          {getTabLabel('all', assignments.length)}
        </button>
        <button onClick={() => setActiveTab('pending')} className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}>
          {getTabLabel('pending', assignments.filter(a => a.status === 'Pending').length)}
        </button>
        <button onClick={() => setActiveTab('submitted')} className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}>
          {getTabLabel('submitted', assignments.filter(a => a.status === 'Submitted').length)}
        </button>
        <button onClick={() => setActiveTab('graded')} className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}>
          {getTabLabel('graded', assignments.filter(a => a.status === 'Graded').length)}
        </button>
        <button onClick={() => setActiveTab('overdue')} className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}>
          {getTabLabel('overdue', assignments.filter(a => a.status === 'Overdue').length)}
        </button>
      </div>

      {/* Grid List or Empty State */}
      {filteredAssignments.length === 0 ? (
        <EmptyState 
          title="No assignments found" 
          message={`You do not have any assignments under the "${activeTab}" category.`}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignment Title</th>
                  <th>Course</th>
                  <th>Deadline</th>
                  <th>Maximum Marks</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assign) => (
                  <tr key={assign.id}>
                    <td style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <strong style={{ fontSize: '0.925rem' }}>{assign.title.split(' — ')[1] || assign.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>{assign.title.split(' — ')[0]}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'left' }}>{assign.courseName}</td>
                    <td style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <Calendar size={14} className="form-message-icon" />
                        <span>
                          {new Date(assign.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                          {new Date(assign.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'left' }}>{assign.marks} Marks</td>
                    <td style={{ textAlign: 'left' }}>
                      <span className={`badge badge-${assign.status.toLowerCase()}`}>
                        {assign.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/student/assignments/${assign.id}`)}
                        className="btn btn-secondary"
                        style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        Open Assignment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
};
export default AssignmentsList;
