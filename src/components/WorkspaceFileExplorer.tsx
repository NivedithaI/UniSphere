import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileText, ChevronRight, ChevronDown, Plus, Trash2, Edit3, RefreshCw } from 'lucide-react';

export interface FileTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  language?: string;
  content?: string | null;
  parent_id?: string | null;
  path?: string;
  children?: FileTreeNode[];
}

interface WorkspaceFileExplorerProps {
  files: FileTreeNode[];
  activeFile: string;
  onSelectFile: (file: FileTreeNode) => void;
  onCreateFile?: (parentId: string | null, parentPath: string, type: 'file' | 'folder') => void;
  onRenameFile?: (file: FileTreeNode) => void;
  onDeleteFile?: (file: FileTreeNode) => void;
  onRefresh?: () => void;
}

const FileTreeItem: React.FC<{
  node: FileTreeNode;
  depth: number;
  activeFile: string;
  onSelectFile: (file: FileTreeNode) => void;
  onCreateFile?: (parentId: string | null, parentPath: string, type: 'file' | 'folder') => void;
  onRenameFile?: (file: FileTreeNode) => void;
  onDeleteFile?: (file: FileTreeNode) => void;
}> = ({ node, depth, activeFile, onSelectFile, onCreateFile, onRenameFile, onDeleteFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showActions, setShowActions] = useState(false);

  if (node.type === 'folder') {
    return (
      <div className="file-tree-folder">
        <div 
          className="file-tree-folder-title" 
          style={{ paddingLeft: `${depth * 12 + 8}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', minWidth: 0 }}>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {isOpen ? <FolderOpen size={15} className="folder-icon" /> : <Folder size={15} className="folder-icon" />}
            <span className="node-name">{node.name}</span>
          </div>
          {showActions && (
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              {onCreateFile && (
                <button className="ide-btn-icon" style={{ padding: '1px' }} title="New File" onClick={() => onCreateFile(node.id, node.path || node.name, 'file')}>
                  <Plus size={12} />
                </button>
              )}
              {onRenameFile && (
                <button className="ide-btn-icon" style={{ padding: '1px' }} title="Rename" onClick={() => onRenameFile(node)}>
                  <Edit3 size={11} />
                </button>
              )}
              {onDeleteFile && (
                <button className="ide-btn-icon" style={{ padding: '1px' }} title="Delete" onClick={() => onDeleteFile(node)}>
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          )}
        </div>
        {isOpen && node.children && (
          <div className="file-tree-children">
            {node.children.map((child, idx) => (
              <FileTreeItem
                key={child.id || `${child.name}-${idx}`}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
                onCreateFile={onCreateFile}
                onRenameFile={onRenameFile}
                onDeleteFile={onDeleteFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = activeFile === node.id || activeFile === node.name;

  return (
    <div 
      className={`file-tree-file-item ${isSelected ? 'selected' : ''}`}
      style={{ paddingLeft: `${depth * 12 + 22}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      onClick={() => onSelectFile(node)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
        {node.name.endsWith('.md') || node.name.endsWith('.json') ? (
          <FileText size={14} className="file-icon" />
        ) : (
          <FileCode size={14} className="file-icon code-icon" />
        )}
        <span className="node-name">{node.name}</span>
      </div>
      {showActions && (
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {onRenameFile && (
            <button className="ide-btn-icon" style={{ padding: '1px' }} title="Rename" onClick={() => onRenameFile(node)}>
              <Edit3 size={11} />
            </button>
          )}
          {onDeleteFile && (
            <button className="ide-btn-icon" style={{ padding: '1px' }} title="Delete" onClick={() => onDeleteFile(node)}>
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const WorkspaceFileExplorer: React.FC<WorkspaceFileExplorerProps> = ({
  files, activeFile, onSelectFile, onCreateFile, onRenameFile, onDeleteFile, onRefresh
}) => {
  return (
    <div className="workspace-file-explorer">
      <div className="explorer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>PROJECT EXPLORER</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {onCreateFile && (
            <button className="ide-btn-icon" style={{ padding: '2px' }} title="New File in Root" onClick={() => onCreateFile(null, '', 'file')}>
              <Plus size={14} />
            </button>
          )}
          {onRefresh && (
            <button className="ide-btn-icon" style={{ padding: '2px' }} title="Refresh Explorer" onClick={onRefresh}>
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>
      <div className="explorer-tree-container">
        {files.length === 0 ? (
          <div style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--brand-dark-grey)', textAlign: 'center' }}>
            No files yet. Click + to create one.
          </div>
        ) : (
          files.map((fileNode, idx) => (
            <FileTreeItem
              key={fileNode.id || `${fileNode.name}-${idx}`}
              node={fileNode}
              depth={0}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              onCreateFile={onCreateFile}
              onRenameFile={onRenameFile}
              onDeleteFile={onDeleteFile}
            />
          ))
        )}
      </div>
    </div>
  );
};
