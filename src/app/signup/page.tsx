'use client';

import { useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from "./signup.module.css";

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.register({ 
        username,
        email, 
        password,
      });

      setSuccess(true);
      // Optional: automatically redirect after success
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupInner}>
          <h1 className={styles.signupHeader}>Sign Up</h1>
          {success ? (
            <div className={styles.error} style={{ color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              Check your email for the confirmation link! Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSignup}>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="username" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                  Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    disabled={isLoading}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
                  Confirm Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    disabled={isLoading}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.button}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/login"
              className={styles.link}
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}