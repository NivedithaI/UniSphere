import React from 'react';
import { GitBranch, Clock, User, Check } from 'lucide-react';
import type { GitBranchItem } from '../data/repositories';

interface BranchListProps {
  branches: GitBranchItem[];
  currentBranch: string;
  onSelectBranch: (branchName: string) => void;
}

export const BranchList: React.FC<BranchListProps> = ({
  branches,
  currentBranch,
  onSelectBranch
}) => {
  return (
    <div className="branches-list-container">
      <div className="section-sub-header">
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Git Branches</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--brand-dark-grey)' }}>
          {branches.length} branches available
        </span>
      </div>

      <div className="branches-grid">
        {branches.map((branch) => {
          const isActive = currentBranch === branch.name;
          return (
            <div 
              key={branch.id}
              className={`branch-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectBranch(branch.name)}
            >
              <div className="branch-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GitBranch size={16} className="branch-icon" />
                  <span className="branch-name font-mono">{branch.name}</span>
                  {branch.isDefault && (
                    <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>default</span>
                  )}
                </div>
                {isActive && (
                  <span className="badge badge-active" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Check size={12} /> Active
                  </span>
                )}
              </div>

              <p className="branch-last-commit">{branch.lastCommitMessage}</p>

              <div className="branch-meta-line font-mono">
                <span><User size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />{branch.author}</span>
                <span><Clock size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />{branch.updatedTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
