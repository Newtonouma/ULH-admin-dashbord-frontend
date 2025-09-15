'use client';

import { useState, useEffect } from 'react';
import { Donation, CreateDonationData } from '../../../types';
import styles from './DonationEditor.module.css';

interface DonationEditorProps {
  donation?: Donation;
  onSave: (data: CreateDonationData) => Promise<boolean>;
  onClose: () => void;
}

export default function DonationEditor({ donation, onSave, onClose }: DonationEditorProps) {
  const [formData, setFormData] = useState({
    amount: 0,
    currency: 'USD',
    donorName: '',
    donorEmail: '',
    causeId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (donation) {
      setFormData({
        amount: donation.amount || 0,
        currency: donation.currency || 'USD',
        donorName: donation.donorName || '',
        donorEmail: donation.donorEmail || '',
        causeId: donation.causeId || '',
        message: donation.message || '',
      });
    } else {
      setFormData({
        amount: 0,
        currency: 'USD',
        donorName: '',
        donorEmail: '',
        causeId: '',
        message: '',
      });
    }
  }, [donation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const backendData: CreateDonationData = {
        amount: formData.amount,
        currency: formData.currency,
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        causeId: formData.causeId || undefined,
        message: formData.message || undefined,
      };
      
      const success = await onSave(backendData);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError('Failed to save donation. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.editorHeader}>
          <h2>{donation ? 'Edit Donation' : 'Add Donation'}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.editorForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className={styles.formSelect}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="donorName">Donor Name</label>
            <input
              id="donorName"
              name="donorName"
              type="text"
              value={formData.donorName}
              onChange={handleChange}
              required
              placeholder="Enter donor's full name"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="donorEmail">Donor Email</label>
            <input
              id="donorEmail"
              name="donorEmail"
              type="email"
              value={formData.donorEmail}
              onChange={handleChange}
              required
              placeholder="donor@example.com"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="causeId">Cause ID (Optional)</label>
            <input
              id="causeId"
              name="causeId"
              type="text"
              value={formData.causeId}
              onChange={handleChange}
              placeholder="Enter cause ID if donation is for a specific cause"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter any message from the donor"
              rows={3}
              className={styles.formTextarea}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.spinner}></span>
              ) : (
                donation ? 'Update Donation' : 'Create Donation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}