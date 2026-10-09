import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { PasswordField } from '../components/PasswordField';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormMessage } from '../components/FormMessage';
import { useAuth } from '../app/context/AuthContext';

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  
  // Form states
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation/feedback states
  const [errors, setErrors] = useState<{ usn?: string; password?: string }>({});
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string | null }>({
    type: null,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const tempErrors: { usn?: string; password?: string } = {};
    let isValid = true;

    if (!usn.trim()) {
      tempErrors.usn = "Please enter your Student ID / USN or Email.";
      isValid = false;
    } else if (usn.trim().length < 4) {
      tempErrors.usn = "Student ID / USN or Email must be at least 4 characters.";
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
      const { profile } = await signIn(usn, password);
      setStatus({ type: 'success', message: "Successfully signed in! Redirecting..." });
      
      const targetRole = profile?.role || 'STUDENT';
      setTimeout(() => {
        if (targetRole === 'ADMIN') navigate('/admin/dashboard');
        else if (targetRole === 'HOD') navigate('/hod/dashboard');
        else if (targetRole === 'FACULTY') navigate('/faculty/dashboard');
        else navigate('/student/dashboard');
      }, 500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid Student ID/USN or password.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!usn.trim()) {
      setStatus({ type: 'error', message: "Please enter your email address in the field above to reset your password." });
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(usn);
      setStatus({ type: 'success', message: `Password reset instructions have been sent to ${usn}.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Password reset failed.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Student Portal" 
      subtitle="Welcome back" 
      theme="student"
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <FormMessage type={status.type} message={status.message} />

        <FormField
          label="Student ID / USN or Email"
          id="student-usn"
          placeholder="e.g. 1AB20CS001 or student@aiet.edu"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          error={errors.usn}
          disabled={isLoading}
          required
        />

        <PasswordField
          label="Password"
          id="student-password"
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
              id="student-remember"
            />
            Remember me
          </label>
          <a href="#forgot" onClick={handleForgotPassword} className="forgot-password-link">
            Forgot password?
          </a>
        </div>

        <PrimaryButton 
          type="submit" 
          isLoading={isLoading}
          id="student-submit-btn"
        >
          Sign In
        </PrimaryButton>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--brand-dark-grey)' }}>
        Don't have an account?{' '}
        <Link to="/signup/student" style={{ fontWeight: 600, color: 'var(--brand-orange)' }}>
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};
