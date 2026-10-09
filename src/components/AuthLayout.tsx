import React from 'react';
import { AuthLogo } from './AuthLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  theme?: 'student' | 'faculty' | 'admin' | 'default';
  showLogo?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  theme = 'default',
  showLogo = true,
}) => {
  return (
    <div className={`auth-layout-container ${theme === 'student' ? 'student-theme' : ''}`}>
      <div className="auth-card">
        {showLogo && <AuthLogo subtext="" />}
        
        <div style={{ textAlign: 'center', marginTop: showLogo ? '0.5rem' : '0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--brand-black)' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--brand-dark-grey)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {children}
        
        <div className="auth-footer">
          <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>
            © {new Date().getFullYear()} AIET-UniSphere. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};
