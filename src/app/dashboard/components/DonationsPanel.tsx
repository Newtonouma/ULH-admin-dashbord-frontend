'use client';

import { useState, useEffect } from 'react';
import { Donation, CreateDonationData } from '../../../types';
import { useDonations } from '../hooks/useDonations';
import DonationCard from './DonationCard';
import DonationEditor from './DonationEditor';
import styles from './DonationsPanel.module.css';

export default function DonationsPanel() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { loading, error, createDonation, updateDonation, deleteDonation, refetch } = useDonations();

  useEffect(() => {
    const loadDonations = async () => {
      try {
        await refetch();
      } catch (err) {
        console.error('Failed to load donations:', err);
      }
    };
    
    loadDonations();
  }, [refetch]);

  const handleCreate = () => {
    setSelectedDonation(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      const success = await deleteDonation(id);
      if (success) {
        setDonations(donations.filter(donation => donation.id !== id));
      }
    }
  };

  const handleSave = async (data: CreateDonationData): Promise<boolean> => {
    let success: boolean;
    if (selectedDonation && selectedDonation.id) {
      success = await updateDonation(selectedDonation.id, data);
      if (success) {
        await refetch();
      }
    } else {
      success = await createDonation(data);
      if (success) {
        await refetch();
      }
    }
    return success;
  };

  if (loading) {
    return (
      <div className={styles.donationsPanel}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.donationsPanel}>
        <div className={styles.errorState}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.donationsPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerContent}>
          <h2>Donations Management</h2>
          <p className={styles.subtitle}>View and manage donations received</p>
        </div>
        <button
          className={styles.addButton}
          onClick={handleCreate}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add New Donation
        </button>
      </div>

      {donations.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2Z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6H14" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>No Donations Yet</h3>
          <p>Donations will appear here when received</p>
          <button
            className={styles.addButton}
            onClick={handleCreate}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Test Donation
          </button>
        </div>
      ) : (
        <div className={styles.donationsGrid}>
          {donations.map(donation => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isEditorOpen && (
        <DonationEditor
          donation={selectedDonation}
          onSave={handleSave}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedDonation(undefined);
          }}
        />
      )}
    </div>
  );
}