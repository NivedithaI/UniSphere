import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  errorMessage?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  errorMessage,
  id,
  type = "text",
  className = "",
  ...props
}) => {
  const displayError = error || errorMessage;
  const fieldId = id || props.name || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">
        {label}
      </label>
      <div className="form-input-container">
        <input
          id={fieldId}
          type={type}
          className={`form-input ${displayError ? 'has-error' : ''} ${className}`}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${fieldId}-error` : undefined}
          {...props}
        />
      </div>
      {displayError && (
        <span 
          id={`${fieldId}-error`} 
          style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-error)', 
            marginTop: '0.125rem',
            textAlign: 'left',
            display: 'block'
          }}
        >
          {displayError}
        </span>
      )}
    </div>
  );
};
