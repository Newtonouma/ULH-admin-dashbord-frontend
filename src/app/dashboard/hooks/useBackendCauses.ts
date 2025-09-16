import { useState, useEffect } from 'react';
import { CausesApi } from '../../../services/api';
import { Cause, CreateCauseData, UpdateCauseData } from '../../../types';

export function useCauses() {
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCauses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CausesApi.getAll();
      setCauses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch causes';
      setError(errorMessage);
      console.error('Error fetching causes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCause = async (causeData: Partial<Cause>): Promise<boolean> => {
    try {
      setError(null);
      const createData: CreateCauseData = {
        title: causeData.title || '',
        goal: causeData.goal || 0,
        category: causeData.category || '',
        description: causeData.description || '',
        imageUrls: causeData.imageUrls || [],
      };
      
      const newCause = await CausesApi.create(createData);
      setCauses(prev => [...prev, newCause]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create cause';
      setError(errorMessage);
      console.error('Error creating cause:', err);
      return false;
    }
  };

  const updateCause = async (id: string, causeData: Partial<Cause>): Promise<boolean> => {
    try {
      setError(null);
      const updateData: UpdateCauseData = {
        title: causeData.title,
        goal: causeData.goal,
        category: causeData.category,
        description: causeData.description,
        imageUrls: causeData.imageUrls,
        raised: causeData.raised,
      };
      
      const updatedCause = await CausesApi.update(id, updateData);
      setCauses(prev => prev.map(cause => 
        cause.id === id ? updatedCause : cause
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cause';
      setError(errorMessage);
      console.error('Error updating cause:', err);
      return false;
    }
  };

  const deleteCause = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await CausesApi.delete(id);
      setCauses(prev => prev.filter(cause => cause.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete cause';
      setError(errorMessage);
      console.error('Error deleting cause:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  return {
    causes,
    loading,
    error,
    createCause,
    updateCause,
    deleteCause,
    refetch: fetchCauses,
  };
}