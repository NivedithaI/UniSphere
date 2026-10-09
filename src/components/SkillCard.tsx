import React from 'react';
import { Award, CheckCircle2, FolderGit2 } from 'lucide-react';
import type { SkillItem } from '../data/skills';
import { ProgressBar } from './ProgressBar';

interface SkillCardProps {
  skill: SkillItem;
  onOpenEvidence: (skill: SkillItem) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onOpenEvidence }) => {
  const getLevelBadgeClass = (level: SkillItem['level']) => {
    switch (level) {
      case 'Advanced':
        return 'badge-active';
      case 'Intermediate':
        return 'badge-pending';
      case 'Developing':
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="skill-card-item">
      <div className="skill-card-header">
        <div>
          <h4 className="skill-name font-display">{skill.name}</h4>
          <span className="font-mono text-dark-grey" style={{ fontSize: '0.75rem' }}>
            Category: {skill.category}
          </span>
        </div>

        <span className={`badge ${getLevelBadgeClass(skill.level)} font-mono`}>
          {skill.level}
        </span>
      </div>

      <div className="skill-progress-wrapper" style={{ margin: '0.75rem 0' }}>
        <ProgressBar progress={skill.percent} label={`Mastery: ${skill.percent}%`} />
      </div>

      <div className="skill-card-footer">
        <span className="font-mono text-dark-grey" style={{ fontSize: '0.8rem' }}>
          <CheckCircle2 size={13} className="text-orange" style={{ display: 'inline', marginRight: '0.25rem' }} />
          {skill.evidenceList.length} verified evidence link{skill.evidenceList.length > 1 ? 's' : ''}
        </span>

        <button 
          className="btn btn-secondary" 
          style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => onOpenEvidence(skill)}
        >
          <span>View Evidence</span>
        </button>
      </div>
    </div>
  );
};
