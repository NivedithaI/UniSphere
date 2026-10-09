import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`btn btn-primary ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          <span>Signing in...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
