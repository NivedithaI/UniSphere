import React from 'react';
import { X, CheckCircle2, FolderGit2, FileText, Award, ExternalLink } from 'lucide-react';
import type { SkillItem, SkillEvidenceItem } from '../data/skills';

interface SkillEvidenceModalProps {
  skill: SkillItem | null;
  onClose: () => void;
}

export const SkillEvidenceModal: React.FC<SkillEvidenceModalProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  const getTypeIcon = (type: SkillEvidenceItem['type']) => {
    switch (type) {
      case 'Project':
        return <FolderGit2 size={16} className="text-orange" />;
      case 'Assessment':
        return <FileText size={16} className="text-blue" />;
      case 'Git Activity':
        return <CheckCircle2 size={16} className="text-orange" />;
      case 'Course':
      default:
        return <Award size={16} className="text-blue" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge badge-active font-mono">{skill.category}</span>
            <h2 className="modal-title font-display" style={{ marginTop: '0.25rem' }}>
              Skill Evidence: {skill.name}
            </h2>
          </div>

          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="font-sans text-dark-grey" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
            Verified course assignments, project modules, assessments, and Git activities supporting proficiency level (<strong>{skill.level} — {skill.percent}%</strong>).
          </p>

          <h4 className="section-title font-display" style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            Supporting Evidence ({skill.evidenceList.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {skill.evidenceList.map((ev) => (
              <div key={ev.id} className="evidence-item-card">
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <div className="evidence-icon-wrapper">
                    {getTypeIcon(ev.type)}
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-black)' }}>{ev.title}</span>
                      <span className="font-mono text-dark-grey" style={{ fontSize: '0.75rem' }}>{ev.date}</span>
                    </div>

                    <span className="badge badge-secondary font-mono" style={{ fontSize: '0.65rem', margin: '0.25rem 0' }}>
                      {ev.type}
                    </span>

                    <p style={{ fontSize: '0.825rem', color: 'var(--brand-dark-grey)', marginTop: '0.15rem' }}>
                      {ev.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {skill.relatedProjects.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <h4 className="section-title font-display" style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                Related Projects
              </h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {skill.relatedProjects.map((p, idx) => (
                  <span key={idx} className="tech-chip font-mono">
                    <FolderGit2 size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
