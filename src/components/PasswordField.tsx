import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  error,
  id,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="form-input-container">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`form-input form-input-with-icon ${error ? 'has-error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          id={`${id}-toggle`}
        >
          {showPassword ? (
            <EyeOff size={18} className="form-message-icon" />
          ) : (
            <Eye size={18} className="form-message-icon" />
          )}
        </button>
      </div>
      {error && (
        <span 
          id={`${id}-error`} 
          style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-error)', 
            marginTop: '0.125rem',
            textAlign: 'left',
            display: 'block'
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
