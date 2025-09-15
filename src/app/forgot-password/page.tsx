'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import styles from "../login/login.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err && typeof (err as Error).message === 'string') {
        setError((err as Error).message);
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginInner}>
            <h1 className={styles.loginHeader}>
              Check Your Email
            </h1>
            <div className={styles.successMessage}>
              <p>We've sent a password reset link to your email address.</p>
              <p>Please check your inbox and follow the instructions to reset your password.</p>
            </div>
            <div className={styles.linkContainer}>
              <Link href="/login" className={styles.link}>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginInner}>
          <h1 className={styles.loginHeader}>
            Reset Your Password
          </h1>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleForgotPassword}>
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className={styles.button}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className={styles.linkContainer}>
            <Link href="/login" className={styles.link}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}