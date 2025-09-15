'use client';

import { useState, useEffect, useCallback } from 'react';
import { Donation, CreateDonationData, UpdateDonationData } from '../../../types';
import { DonationsApi } from '../../../services/api';

export interface UseDonationsReturn {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  createDonation: (data: CreateDonationData) => Promise<boolean>;
  updateDonation: (id: string, data: UpdateDonationData) => Promise<boolean>;
  deleteDonation: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useDonations(): UseDonationsReturn {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DonationsApi.getAll();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDonation = useCallback(async (data: CreateDonationData): Promise<boolean> => {
    try {
      setError(null);
      await DonationsApi.create(data);
      await fetchDonations(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error creating donation:', err);
      setError(err instanceof Error ? err.message : 'Failed to create donation');
      return false;
    }
  }, [fetchDonations]);

  const updateDonation = useCallback(async (id: string, data: UpdateDonationData): Promise<boolean> => {
    try {
      setError(null);
      await DonationsApi.update(id, data);
      await fetchDonations(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error updating donation:', err);
      setError(err instanceof Error ? err.message : 'Failed to update donation');
      return false;
    }
  }, [fetchDonations]);

  const deleteDonation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await DonationsApi.delete(id);
      setDonations(prev => prev.filter(donation => donation.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting donation:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete donation');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return {
    donations,
    loading,
    error,
    createDonation,
    updateDonation,
    deleteDonation,
    refetch: fetchDonations,
  };
}