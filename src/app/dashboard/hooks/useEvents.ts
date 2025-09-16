import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Event } from '../../../types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Event[]>('/events');
      setEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveEvent = async (
    eventData: Partial<Event>,
    files: File[] = [],
    existingImages: string[] = [],
    imagesToDelete: string[] = [],
    eventId?: string,
    directFormData?: FormData
  ): Promise<boolean> => {
    try {
      setError(null);
      
      let formData: FormData;
      
      if (directFormData) {
        // Use the FormData passed directly from EventEditor
        formData = directFormData;
      } else {
        // Create FormData from parameters (legacy support)
        formData = new FormData();
        
        // Add text fields
        if (eventData.title) formData.append('title', eventData.title);
        if (eventData.description) formData.append('description', eventData.description);
        if (eventData.date) formData.append('date', eventData.date);
        if (eventData.startTime) formData.append('startTime', eventData.startTime);
        if (eventData.endTime) formData.append('endTime', eventData.endTime);
        if (eventData.location) formData.append('location', eventData.location);
        
        // Add file attachments
        files.forEach(file => {
          formData.append('images', file);
        });
        
        // Add existing images and deletion info
        formData.append('existingImages', JSON.stringify(existingImages));
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      let savedEvent: Event;
      
      if (eventId) {
        // Update existing event
        savedEvent = await apiClient.patch<Event>(`/events/${eventId}`, formData);
        setEvents(prev => prev.map(event => 
          event.id === eventId ? savedEvent : event
        ));
      } else {
        // Create new event
        savedEvent = await apiClient.post<Event>('/events', formData);
        setEvents(prev => [...prev, savedEvent]);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save event';
      setError(errorMessage);
      console.error('Error saving event:', err);
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await apiClient.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      console.error('Error deleting event:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    saveEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}