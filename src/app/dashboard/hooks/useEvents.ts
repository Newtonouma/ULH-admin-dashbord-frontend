import { useState, useEffect } from 'react';
import { EventsApi } from '../../../services/api';
import { Event, CreateEventData, UpdateEventData } from '../../../types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventsApi.getAll();
      setEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<Event>): Promise<boolean> => {
    try {
      setError(null);
      const createData: CreateEventData = {
        title: eventData.title || '',
        description: eventData.description || '',
        date: eventData.date || new Date().toISOString(),
        endTime: eventData.endTime,
        location: eventData.location || '',
        imageUrl: eventData.imageUrl,
      };
      
      const newEvent = await EventsApi.create(createData);
      setEvents(prev => [...prev, newEvent]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      console.error('Error creating event:', err);
      return false;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<boolean> => {
    try {
      setError(null);
      const updateData: UpdateEventData = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        endTime: eventData.endTime,
        location: eventData.location,
        imageUrl: eventData.imageUrl,
      };
      
      const updatedEvent = await EventsApi.update(id, updateData);
      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      console.error('Error updating event:', err);
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await EventsApi.delete(id);
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
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}