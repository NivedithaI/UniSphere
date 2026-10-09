import React from 'react';
import logoImg from '../assets/logo.png';
import iconImg from '../assets/icon.png';

interface AuthLogoProps {
  compact?: boolean;
  subtext?: string;
}

export const AuthLogo: React.FC<AuthLogoProps> = ({ 
  compact = false, 
  subtext = "Your Digital Academic Campus" 
}) => {
  return (
    <div className="logo-wrapper">
      {compact ? (
        <img 
          src={iconImg} 
          alt="AIET-UniSphere Icon" 
          className="compact-logo-img" 
        />
      ) : (
        <img 
          src={logoImg} 
          alt="AIET-UniSphere Logo" 
          className="full-logo-img" 
        />
      )}
      {subtext && <span className="logo-subtext">{subtext}</span>}
    </div>
  );
};
