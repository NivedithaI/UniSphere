import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Shield } from 'lucide-react';
import { AuthLogo } from '../components/AuthLogo';
import { RoleCard } from '../components/RoleCard';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access your courses, assignments, attendance and academic progress.',
      icon: <GraduationCap size={28} />,
      route: '/login/student'
    },
    {
      id: 'faculty',
      title: 'Faculty / HOD',
      description: 'Manage academic activities, students and performance.',
      icon: <BookOpen size={28} />,
      route: '/login/faculty'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage institutional operations and platform administration.',
      icon: <Shield size={28} />,
      route: '/login/admin'
    }
  ];

  const handleRoleSelection = (roleId: string, route: string) => {
    setSelectedRole(roleId);
    setTimeout(() => {
      navigate(route);
    }, 150); // Small delay for visual feedback
  };

  return (
    <div className="auth-layout-container" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div className="role-selection-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <AuthLogo subtext="" />
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brand-black)' }}>
              Welcome to AIET-UniSphere
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--brand-dark-grey)', marginTop: '0.25rem' }}>
              Your Digital Academic Campus
            </p>
          </div>
        </div>

        <div className="role-cards-grid">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              icon={role.icon}
              role={role.title}
              description={role.description}
              isSelected={selectedRole === role.id}
              onContinue={() => handleRoleSelection(role.id, role.route)}
            />
          ))}
        </div>

        <div className="auth-footer" style={{ marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--brand-dark-grey)' }}>
            © {new Date().getFullYear()} AIET-UniSphere. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};
