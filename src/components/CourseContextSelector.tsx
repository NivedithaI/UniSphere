import React from 'react';
import { BookOpen } from 'lucide-react';

interface CourseContextSelectorProps {
  contexts: string[];
  selectedContext: string;
  onSelectContext: (context: string) => void;
}

export const CourseContextSelector: React.FC<CourseContextSelectorProps> = ({
  contexts,
  selectedContext,
  onSelectContext
}) => {
  return (
    <div className="course-context-selector-container">
      <label className="context-label font-mono">
        <BookOpen size={14} className="text-orange" />
        <span>Course Context:</span>
      </label>

      <select
        className="form-control context-select-input font-sans"
        value={selectedContext}
        onChange={(e) => onSelectContext(e.target.value)}
      >
        {contexts.map((ctx) => (
          <option key={ctx} value={ctx}>
            {ctx}
          </option>
        ))}
      </select>
    </div>
  );
};
