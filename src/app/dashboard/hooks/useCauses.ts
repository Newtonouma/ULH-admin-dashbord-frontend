'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cause } from '../../../types';
import { apiClient } from '../../../lib/api-client';

export function useCauses() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCauses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Cause[]>('/causes');
      setCauses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createCause = useCallback(async (formData: FormData) => {
    try {
      await apiClient.post('/causes', formData);
      setError(null);
      await fetchCauses(); // Refetch causes after creating
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchCauses]);

  const deleteCause = async (id: string) => {
    try {
      await apiClient.delete(`/causes/${id}`);
      setError(null);
      await fetchCauses(); // Refetch causes after deleting
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const updateCause = async (id: string, formData: FormData) => {
    try {
      await apiClient.patch(`/causes/${id}`, formData);
      setError(null);
      await fetchCauses(); // Refetch causes after updating
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };
  
  useEffect(() => {
    fetchCauses();
  }, [fetchCauses]);

  return {
    causes,
    loading,
    error,
    createCause,
    deleteCause,
    updateCause,
    refreshCauses: fetchCauses
  };
} 