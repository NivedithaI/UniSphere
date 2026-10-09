import React, { useState } from 'react';
import { GitPullRequest, PlusCircle, Edit, Trash2, CheckCircle2, Send } from 'lucide-react';
import type { GitFileChange } from '../data/repositories';

interface ChangeListProps {
  changes: GitFileChange;
  onCommit: (message: string) => Promise<void>;
}

export const ChangeList: React.FC<ChangeListProps> = ({ changes, onCommit }) => {
  const [commitMsg, setCommitMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalChanges = changes.modified.length + changes.added.length + changes.deleted.length;

  const handleSubmitCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMsg.trim()) {
      alert('Please provide a commit message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCommit(commitMsg);
      setCommitMsg('');
    } catch (err) {
      alert('Failed to record commit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="git-changes-panel">
      <div className="section-sub-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitPullRequest size={18} style={{ color: 'var(--brand-orange)' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Uncommitted Changes</h4>
        </div>
        <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>
          {totalChanges} file{totalChanges !== 1 ? 's' : ''} modified
        </span>
      </div>

      {totalChanges === 0 ? (
        <div className="empty-changes-box">
          <CheckCircle2 size={32} style={{ color: 'var(--color-success)' }} />
          <p style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--brand-black)' }}>
            Working tree clean
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--brand-dark-grey)' }}>
            No uncommitted changes in current working directory.
          </span>
        </div>
      ) : (
        <div className="changes-content-wrapper">
          {/* Modified files */}
          {changes.modified.length > 0 && (
            <div className="change-category-group">
              <div className="change-category-title modified">
                <Edit size={14} /> Modified ({changes.modified.length})
              </div>
              <div className="change-file-list font-mono">
                {changes.modified.map(file => (
                  <div key={file} className="change-file-item modified">
                    <span className="status-indicator">M</span>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Added files */}
          {changes.added.length > 0 && (
            <div className="change-category-group">
              <div className="change-category-title added">
                <PlusCircle size={14} /> Added ({changes.added.length})
              </div>
              <div className="change-file-list font-mono">
                {changes.added.map(file => (
                  <div key={file} className="change-file-item added">
                    <span className="status-indicator">A</span>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deleted files */}
          {changes.deleted.length > 0 && (
            <div className="change-category-group">
              <div className="change-category-title deleted">
                <Trash2 size={14} /> Deleted ({changes.deleted.length})
              </div>
              <div className="change-file-list font-mono">
                {changes.deleted.map(file => (
                  <div key={file} className="change-file-item deleted">
                    <span className="status-indicator">D</span>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commit UI */}
          <form onSubmit={handleSubmitCommit} className="commit-form-box">
            <label htmlFor="commit-msg-input" className="form-label" style={{ fontSize: '0.85rem' }}>
              Commit message
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
              <input 
                id="commit-msg-input"
                type="text"
                className="form-input"
                placeholder="feat: concise commit description..."
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: 'auto', whiteSpace: 'nowrap' }}
                disabled={isSubmitting || !commitMsg.trim()}
              >
                <Send size={15} />
                {isSubmitting ? 'Committing...' : 'Commit Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
