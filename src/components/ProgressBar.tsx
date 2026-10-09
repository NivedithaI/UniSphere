import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  showPercentage = true 
}) => {
  const boundedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className="metric-row">
      {(label || showPercentage) && (
        <div className="metric-label-row">
          {label && <span>{label}</span>}
          {showPercentage && <span>{boundedProgress}%</span>}
        </div>
      )}
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${boundedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};
