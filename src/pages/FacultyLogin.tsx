import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { PasswordField } from '../components/PasswordField';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormMessage } from '../components/FormMessage';
import { useAuth } from '../app/context/AuthContext';
import { authService } from '../services/authService';

export const FacultyLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();

  // Role sub-selection state (Faculty vs HOD)
  const [subRole, setSubRole] = useState<'faculty' | 'hod'>('faculty');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation/feedback states
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string | null }>({
    type: null,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    if (!identifier.trim()) {
      tempErrors.identifier = "Please enter your Email or Employee ID.";
      isValid = false;
    } else if (identifier.trim().length < 4) {
      tempErrors.identifier = "Please enter a valid Employee ID or Email.";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Please enter your password.";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: null });

    if (!validateForm()) {
      setStatus({ type: 'error', message: "Please resolve the errors highlighted below." });
      return;
    }

    setIsLoading(true);

    try {
      const { profile } = await signIn(identifier, password);

      if (!profile) {
        await authService.signOut();
        throw new Error('Access denied: Profile not found.');
      }

      if (subRole === 'hod' && profile.role !== 'HOD' && profile.role !== 'ADMIN') {
        await authService.signOut();
        throw new Error('Access denied: Selected HOD portal requires a registered HOD account.');
      }

      if (subRole === 'faculty' && profile.role !== 'FACULTY' && profile.role !== 'HOD' && profile.role !== 'ADMIN') {
        await authService.signOut();
        throw new Error('Access denied: Only registered Faculty or HOD accounts can sign in through this portal.');
      }

      const activeRole = profile.role;

      setStatus({ 
        type: 'success', 
        message: `Successfully signed in as ${activeRole === 'HOD' ? 'Head of Department (HOD)' : activeRole === 'ADMIN' ? 'Administrator' : 'Faculty'}! Redirecting to Dashboard...` 
      });

      setTimeout(() => {
        if (activeRole === 'HOD') {
          navigate('/hod/dashboard');
        } else if (activeRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/faculty/dashboard');
        }
      }, 500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid Employee ID/Email or password.';
      setStatus({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Faculty & HOD Portal" 
      subtitle="Institutional Academic Platform" 
      theme="faculty"
    >
      {/* Premium Minimal Segment Selector */}
      <div 
        style={{ 
          display: 'flex', 
          backgroundColor: 'var(--brand-light-grey)', 
          padding: '4px', 
          borderRadius: 'var(--border-radius)',
          border: '1px solid rgba(156, 163, 175, 0.2)',
          width: '100%',
          marginBottom: '0.5rem'
        }}
      >
        <button
          type="button"
          onClick={() => setSubRole('faculty')}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: 'calc(var(--border-radius) - 2px)',
            backgroundColor: subRole === 'faculty' ? 'var(--brand-white)' : 'transparent',
            color: subRole === 'faculty' ? 'var(--brand-blue)' : 'var(--brand-dark-grey)',
            fontWeight: subRole === 'faculty' ? 600 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: subRole === 'faculty' ? 'var(--box-shadow-sm)' : 'none',
            transition: 'var(--transition-smooth)'
          }}
        >
          Faculty
        </button>
        <button
          type="button"
          onClick={() => setSubRole('hod')}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            borderRadius: 'calc(var(--border-radius) - 2px)',
            backgroundColor: subRole === 'hod' ? 'var(--brand-white)' : 'transparent',
            color: subRole === 'hod' ? 'var(--brand-blue)' : 'var(--brand-dark-grey)',
            fontWeight: subRole === 'hod' ? 600 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: subRole === 'hod' ? 'var(--box-shadow-sm)' : 'none',
            transition: 'var(--transition-smooth)'
          }}
        >
          HOD
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <FormMessage type={status.type} message={status.message} />

        <FormField
          label="Email / Employee ID"
          id="faculty-identifier"
          placeholder="e.g. fac1023 or name@aiet.edu"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
          disabled={isLoading}
          required
        />

        <PasswordField
          label="Password"
          id="faculty-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          required
        />

        <div className="form-actions-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              id="faculty-remember"
            />
            Remember me
          </label>
          <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link will be sent to your registered academic email."); }} className="forgot-password-link">
            Forgot password?
          </a>
        </div>

        <PrimaryButton 
          type="submit" 
          isLoading={isLoading}
          id="faculty-submit-btn"
        >
          Sign In
        </PrimaryButton>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '0.5rem' }}>
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); navigate('/'); }} 
          style={{ color: 'var(--brand-dark-grey)', fontWeight: 500 }}
        >
          ← Back to role selection
        </a>
      </div>
    </AuthLayout>
  );
};
