import React from 'react';
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react';
import type { AIConversation } from '../data/aiConversations';

interface ConversationListProps {
  conversations: AIConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onClearConversation: (id: string, e: React.MouseEvent) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onClearConversation
}) => {
  return (
    <div className="ai-conversations-panel">
      <div className="ai-conv-header">
        <button className="btn btn-primary btn-full-width" onClick={onNewConversation}>
          <Plus size={16} />
          <span>New Conversation</span>
        </button>
      </div>

      <div className="ai-conv-list-container">
        <span className="ai-conv-section-label font-mono">Recent Conversations</span>

        {conversations.length === 0 ? (
          <p className="empty-conv-text">No previous conversations.</p>
        ) : (
          conversations.map((c) => {
            const isActive = c.id === activeConversationId;
            return (
              <div
                key={c.id}
                className={`ai-conv-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectConversation(c.id)}
              >
                <MessageSquare size={16} className="conv-icon" />
                <div className="conv-item-content">
                  <span className="conv-item-title">{c.title}</span>
                  <span className="conv-item-meta font-mono">
                    <Clock size={11} style={{ display: 'inline', marginRight: '0.2rem' }} />
                    {c.date} • {c.courseContext}
                  </span>
                </div>

                <button
                  className="conv-delete-btn"
                  onClick={(e) => onClearConversation(c.id, e)}
                  title="Clear conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
