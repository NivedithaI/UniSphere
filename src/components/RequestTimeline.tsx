import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import type { ServiceTimelineStep } from '../data/studentServices';

interface RequestTimelineProps {
  timeline: ServiceTimelineStep[];
}

export const RequestTimeline: React.FC<RequestTimelineProps> = ({ timeline }) => {
  return (
    <div className="request-timeline-container">
      <h3 className="section-title font-display" style={{ marginBottom: '1.25rem' }}>Processing Progress & Timeline</h3>

      <div className="timeline-stepper">
        {timeline.map((item, idx) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';

          return (
            <div key={idx} className={`stepper-step-item ${item.status}`}>
              <div className="stepper-icon-col">
                <div className={`stepper-circle ${item.status}`}>
                  {isCompleted && <CheckCircle2 size={16} />}
                  {isCurrent && <Clock size={16} className="text-orange" />}
                  {!isCompleted && !isCurrent && <Circle size={14} />}
                </div>
                {idx < timeline.length - 1 && (
                  <div className={`stepper-line ${isCompleted ? 'completed-line' : ''}`} />
                )}
              </div>

              <div className="stepper-content-col">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className={`stepper-step-title ${isCurrent ? 'font-bold text-orange' : ''}`}>
                    {item.step}
                  </h4>
                  {item.date && (
                    <span className="font-mono text-dark-grey" style={{ fontSize: '0.75rem' }}>
                      {item.date}
                    </span>
                  )}
                </div>

                {item.note && (
                  <p className="stepper-step-note font-sans">{item.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
