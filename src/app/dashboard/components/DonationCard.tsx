'use client';

import { Donation } from '../../../types';
import styles from "./DonationCard.module.css";

interface DonationCardProps {
  donation: Donation;
  onEdit: (donation: Donation) => void;
  onDelete: (id: string) => void;
}

export default function DonationCard({ donation, onEdit, onDelete }: DonationCardProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return styles.statusCompleted;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.amountSection}>
          <h3 className={styles.amount}>{formatAmount(donation.amount, donation.currency)}</h3>
          <span className={`${styles.status} ${getStatusColor(donation.status)}`}>
            {donation.status || 'completed'}
          </span>
        </div>
        <div className={styles.dateSection}>
          <span className={styles.date}>{formatDate(donation.createdAt)}</span>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.donorInfo}>
          <h4 className={styles.donorName}>{donation.donorName}</h4>
          <p className={styles.donorEmail}>{donation.donorEmail}</p>
        </div>
        
        {donation.message && (
          <div className={styles.messageSection}>
            <p className={styles.message}>{donation.message}</p>
          </div>
        )}
        
        {donation.causeId && (
          <div className={styles.causeSection}>
            <span className={styles.causeLabel}>Cause ID: {donation.causeId}</span>
          </div>
        )}
        
        <div className={styles.donationActions}>
          <button
            className={styles.editButton}
            onClick={() => onEdit(donation)}
          >
            <EditIcon />
            Edit
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => donation.id && onDelete(donation.id)}
          >
            <DeleteIcon />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple icon components
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}