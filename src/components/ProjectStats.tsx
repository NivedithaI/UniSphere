import React from 'react';
import { FolderGit2, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface ProjectStatsProps {
  activeCount: number;
  completedCount: number;
  pendingReviewCount: number;
  upcomingCount: number;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  activeCount,
  completedCount,
  pendingReviewCount,
  upcomingCount
}) => {
  return (
    <div className="stat-cards-grid">
      <div className="stat-card">
        <div className="stat-label-row">
          <span className="stat-card-title">Active Projects</span>
          <FolderGit2 size={18} className="stat-card-icon" />
        </div>
        <span className="stat-card-value">{activeCount}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>In active development</span>
      </div>

      <div className="stat-card">
        <div className="stat-label-row">
          <span className="stat-card-title">Completed</span>
          <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
        </div>
        <span className="stat-card-value">{completedCount}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>Approved & evaluated</span>
      </div>

      <div className="stat-card">
        <div className="stat-label-row">
          <span className="stat-card-title">Pending Review</span>
          <Clock size={18} style={{ color: 'var(--color-warning)' }} />
        </div>
        <span className="stat-card-value">{pendingReviewCount}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>Awaiting faculty signoff</span>
      </div>

      <div className="stat-card">
        <div className="stat-label-row">
          <span className="stat-card-title">Upcoming</span>
          <Calendar size={18} className="stat-card-icon" />
        </div>
        <span className="stat-card-value">{upcomingCount}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>Scheduled milestones</span>
      </div>
    </div>
  );
};
