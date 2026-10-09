import React from 'react';
import { GitCommit, User, Clock, Copy } from 'lucide-react';
import type { GitCommitItem } from '../data/repositories';

interface CommitListProps {
  commits: GitCommitItem[];
}

export const CommitList: React.FC<CommitListProps> = ({ commits }) => {
  return (
    <div className="commit-history-container">
      <div className="section-sub-header">
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Commit History</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--brand-dark-grey)' }}>
          {commits.length} commits recorded
        </span>
      </div>

      <div className="commit-timeline-list">
        {commits.map((commit) => (
          <div key={commit.id} className="commit-row-card">
            <div className="commit-icon-col">
              <div className="commit-dot">
                <GitCommit size={15} />
              </div>
            </div>

            <div className="commit-details-col">
              <h5 className="commit-msg">{commit.message}</h5>
              <div className="commit-meta-line font-mono">
                <span className="commit-author">
                  <User size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                  {commit.author}
                </span>
                <span className="commit-date">
                  <Clock size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                  {commit.date}
                </span>
                <span className="commit-branch-tag">branch: {commit.branch}</span>
              </div>
            </div>

            <div className="commit-hash-col">
              <button 
                className="commit-hash-chip font-mono"
                onClick={() => {
                  navigator.clipboard.writeText(commit.hash);
                  alert(`Copied commit hash: ${commit.hash}`);
                }}
                title="Copy full commit hash"
              >
                <Copy size={12} />
                {commit.shortHash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
