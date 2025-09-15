'use client';

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './ChangePasswordModal.module.css';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { changePassword } = useAuth();

  // Clear errors when user starts typing
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    if (error) setError(null);
    setFieldErrors(prev => ({ ...prev, currentPassword: '' }));
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    if (error) setError(null);
    
    // Real-time validation for new password
    let fieldError = '';
    if (value && value.length < 6) {
      fieldError = 'Password must be at least 6 characters long';
    } else if (value && currentPassword && value === currentPassword) {
      fieldError = 'New password must be different from current password';
    }
    
    setFieldErrors(prev => ({ ...prev, newPassword: fieldError }));
    
    // Also check confirm password if it exists
    if (confirmPassword && value !== confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else if (confirmPassword && value === confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (error) setError(null);
    
    // Real-time validation for confirm password
    let fieldError = '';
    if (value && newPassword && value !== newPassword) {
      fieldError = 'Passwords do not match';
    }
    
    setFieldErrors(prev => ({ ...prev, confirmPassword: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setError(null);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: unknown) {
      console.error('Change password error:', err);
      
      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = (err as Error).message;
        
        // Handle specific error cases
        if (errorMessage.includes('Invalid current password') || errorMessage.includes('incorrect password')) {
          setError('Current password is incorrect. Please try again.');
        } else if (errorMessage.includes('validation failed') || errorMessage.includes('Password must')) {
          setError('New password does not meet requirements. Please ensure it is at least 6 characters long.');
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('Unauthorized')) {
          setError('Session expired. Please log in again and try changing your password.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Failed to change password. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change Password</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h3>Password Changed Successfully!</h3>
            <p>Your password has been updated. This dialog will close automatically.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {/* Current Password */}
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoading}
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {fieldErrors.currentPassword && (
                <div className={styles.fieldError}>
                  {fieldErrors.currentPassword}
                </div>
              )}
            </div>

            {/* New Password */}
            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <div className={styles.fieldError}>
                  {fieldErrors.newPassword}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm New Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={styles.input}
                  disabled={isLoading}
                  required
                  minLength={6}
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
              {fieldErrors.confirmPassword && (
                <div className={styles.fieldError}>
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={
                  isLoading || 
                  !currentPassword || 
                  !newPassword || 
                  !confirmPassword ||
                  !!fieldErrors.currentPassword ||
                  !!fieldErrors.newPassword ||
                  !!fieldErrors.confirmPassword
                }
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}