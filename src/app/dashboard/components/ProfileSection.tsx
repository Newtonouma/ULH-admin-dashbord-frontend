'use client';

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import styles from './ProfileSection.module.css';

export default function ProfileSection() {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileIcon}>👤</div>
        <h1 className={styles.profileTitle}>Profile Information</h1>
        <p className={styles.profileSubtitle}>Manage your account details and settings</p>
      </div>

      <div className={styles.profileContent}>
        {/* Profile Information Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Account Details</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>User ID</label>
              <div className={styles.fieldValue}>{user.id}</div>
            </div>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>Username</label>
              <div className={styles.fieldValue}>{user.username}</div>
            </div>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>Email</label>
              <div className={styles.fieldValue}>{user.email}</div>
            </div>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Security Settings</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.securityInfo}>
              <div className={styles.securityItem}>
                <div className={styles.securityIcon}>🔒</div>
                <div className={styles.securityDetails}>
                  <h3 className={styles.securityTitle}>Password</h3>
                  <p className={styles.securityDescription}>
                    Keep your account secure with a strong password
                  </p>
                </div>
                <button
                  className={styles.changePasswordButton}
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Account Statistics</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>💡</div>
                <div className={styles.statValue}>-</div>
                <div className={styles.statLabel}>Causes Created</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>📅</div>
                <div className={styles.statValue}>-</div>
                <div className={styles.statLabel}>Events Organized</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>🖼️</div>
                <div className={styles.statValue}>-</div>
                <div className={styles.statLabel}>Gallery Items</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statValue}>-</div>
                <div className={styles.statLabel}>Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
}