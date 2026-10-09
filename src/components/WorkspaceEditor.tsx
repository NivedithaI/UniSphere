import React, { useEffect, useCallback } from 'react';
import { X, FileCode, Circle } from 'lucide-react';
import type { FileTreeNode } from './WorkspaceFileExplorer';

interface OpenTab extends FileTreeNode {
  isDirty?: boolean;
  savedContent?: string;
}

interface WorkspaceEditorProps {
  openTabs: OpenTab[];
  activeTab: OpenTab | null;
  onSelectTab: (file: OpenTab) => void;
  onCloseTab: (file: OpenTab, e: React.MouseEvent) => void;
  onContentChange: (newContent: string) => void;
  onSave?: () => void;
}

export const WorkspaceEditor: React.FC<WorkspaceEditorProps> = ({
  openTabs, activeTab, onSelectTab, onCloseTab, onContentChange, onSave
}) => {
  // Ctrl+S handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave?.();
    }
  }, [onSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!activeTab) {
    return (
      <div className="workspace-editor-empty">
        <FileCode size={48} style={{ color: 'var(--brand-grey)', opacity: 0.5 }} />
        <p style={{ marginTop: '0.75rem', fontWeight: 600, color: 'var(--brand-dark-grey)' }}>
          Select a file from the explorer to view or edit
        </p>
      </div>
    );
  }

  const lines = (activeTab.content || '').split('\n');

  return (
    <div className="workspace-editor-container">
      {/* Tabs Header */}
      <div className="editor-tabs-bar">
        {openTabs.map((tab) => {
          const isActive = activeTab.id === tab.id;
          return (
            <div
              key={tab.id}
              className={`editor-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab)}
            >
              <FileCode size={13} className="tab-icon" />
              <span>{tab.name}</span>
              {tab.isDirty && (
                <Circle size={8} style={{ fill: 'var(--brand-orange)', color: 'var(--brand-orange)', marginLeft: '2px' }} />
              )}
              <button 
                className="tab-close-btn" 
                onClick={(e) => onCloseTab(tab, e)}
                aria-label="Close tab"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Editor Content Area */}
      <div className="editor-body">
        <div className="editor-line-numbers font-mono">
          {lines.map((_, idx) => (
            <span key={idx} className="line-num">{idx + 1}</span>
          ))}
        </div>

        <div className="editor-code-area font-mono">
          <textarea
            className="editor-textarea font-mono"
            value={activeTab.content || ''}
            onChange={(e) => onContentChange(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.2rem 0.75rem', fontSize: '0.7rem', color: 'var(--brand-dark-grey)',
        borderTop: '1px solid rgba(156,163,175,0.2)', backgroundColor: 'var(--brand-light-grey)'
      }}>
        <span>{activeTab.language || 'text'} · {activeTab.path || activeTab.name}</span>
        <span>
          {activeTab.isDirty ? (
            <span style={{ color: 'var(--brand-orange)', fontWeight: 600 }}>● Unsaved — Ctrl+S to save</span>
          ) : (
            <span style={{ color: 'var(--color-success)' }}>✓ Saved</span>
          )}
        </span>
      </div>
    </div>
  );
};
