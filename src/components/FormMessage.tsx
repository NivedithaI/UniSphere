import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormMessageProps {
  type: 'error' | 'success' | null;
  message: string | null;
}

export const FormMessage: React.FC<FormMessageProps> = ({ type, message }) => {
  if (!type || !message) return null;

  const isError = type === 'error';

  return (
    <div 
      className={`form-message ${isError ? 'form-message-error' : 'form-message-success'}`}
      role="alert"
    >
      {isError ? (
        <AlertCircle size={18} className="form-message-icon" />
      ) : (
        <CheckCircle size={18} className="form-message-icon" />
      )}
      <span>{message}</span>
    </div>
  );
};
