import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { PasswordField } from '../components/PasswordField';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormMessage } from '../components/FormMessage';
import { useAuth } from '../app/context/AuthContext';

export const StudentSignup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Form states
  const [fullName, setFullName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation/feedback states
  const [errors, setErrors] = useState<{
    fullName?: string;
    usn?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string | null }>({
    type: null,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    if (!fullName.trim()) {
      tempErrors.fullName = "Please enter your full name.";
      isValid = false;
    } else if (fullName.trim().length < 3) {
      tempErrors.fullName = "Full name must be at least 3 characters.";
      isValid = false;
    }

    if (!usn.trim()) {
      tempErrors.usn = "Please enter your Student ID / USN.";
      isValid = false;
    } else if (usn.trim().length < 5) {
      tempErrors.usn = "Student ID / USN must be at least 5 characters.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = "Please enter your email address.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Please enter a password.";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
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
      await signUp({ fullName, usn, email, password });
      setStatus({ 
        type: 'success', 
        message: "Account created successfully! Please check your email to verify your account or sign in." 
      });
      
      setTimeout(() => {
        navigate('/login/student');
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Join the AIET-UniSphere Digital Campus" 
      theme="student"
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <FormMessage type={status.type} message={status.message} />

        <FormField
          label="Full Name"
          id="student-name"
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          disabled={isLoading}
          required
        />

        <FormField
          label="Student ID / USN"
          id="student-usn"
          placeholder="e.g. 1AB20CS001"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          error={errors.usn}
          disabled={isLoading}
          required
        />

        <FormField
          label="Email Address"
          id="student-email"
          type="email"
          placeholder="e.g. johndoe@aiet.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
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

        <PasswordField
          label="Confirm Password"
          id="student-confirm-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={isLoading}
          required
        />

        <PrimaryButton 
          type="submit" 
          isLoading={isLoading}
          id="student-signup-btn"
          style={{ marginTop: '0.5rem' }}
        >
          Create Account
        </PrimaryButton>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--brand-dark-grey)' }}>
        Already have an account?{' '}
        <Link to="/login/student" style={{ fontWeight: 600, color: 'var(--brand-orange)' }}>
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
