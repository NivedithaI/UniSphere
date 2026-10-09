import React from 'react';

interface RoleCardProps {
  icon: React.ReactNode;
  role: string;
  description: string;
  onContinue: () => void;
  isSelected?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  icon,
  role,
  description,
  onContinue,
  isSelected = false,
}) => {
  return (
    <div 
      className={`role-card ${isSelected ? 'selected' : ''}`}
      onClick={onContinue}
    >
      <div className="role-card-icon-wrapper">
        {icon}
      </div>
      <div className="role-card-text" style={{ marginTop: '0.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {role}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--brand-dark-grey)', minHeight: '44px' }}>
          {description}
        </p>
      </div>
      <button 
        className="btn btn-secondary role-continue-btn"
        onClick={(e) => {
          e.stopPropagation();
          onContinue();
        }}
      >
        Continue
      </button>
    </div>
  );
};
