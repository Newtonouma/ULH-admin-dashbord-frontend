'use client';

import { useState } from 'react';
import { Event } from '../../../types';
import { useEvents } from '../hooks/useEvents';
import EventCard from './EventCard';
import EventEditor from './EventEditor';
import styles from "./EventsSection.module.css";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  formData?: FormData;
  existingImages?: string[];
}

export default function EventsSection() {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const {
    events,
    loading,
    error,
    saveEvent,
    deleteEvent,
    refetch
  } = useEvents();

  const handleCreateEvent = async (data: EventFormData) => {
    // Extract data from the new structure
    if (data.formData) {
      // New structure with FormData
      const success = await saveEvent(
        {
          title: data.title,
          description: data.description,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
        },
        [], // files - will be handled by FormData
        data.existingImages || [],
        [],
        undefined,
        data.formData // Pass the FormData
      );
      if (success) {
        setIsCreating(false);
      }
    } else {
      // Legacy structure
      const success = await saveEvent(data);
      if (success) {
        setIsCreating(false);
      }
    }
  };

  const handleEditEvent = async (data: EventFormData) => {
    if (!editingEvent?.id) return;
    
    if (data.formData) {
      // New structure with FormData
      const success = await saveEvent(
        {
          title: data.title,
          description: data.description,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
        },
        [], // files - will be handled by FormData
        data.existingImages || [],
        [],
        editingEvent.id,
        data.formData // Pass the FormData
      );
      if (success) {
        setEditingEvent(null);
      }
    } else {
      // Legacy structure
      const success = await saveEvent(data, [], [], [], editingEvent.id);
      if (success) {
        setEditingEvent(null);
      }
    }
  };  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            ⚠️ {error}
          </p>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Events</h1>
          <p className={styles.subtitle}>Discover and manage upcoming events</p>
        </div>
        <button 
          className={styles.createButton}
          onClick={() => setIsCreating(true)}
          disabled={loading}
        >
          ✨ Create New Event
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : events.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No Events Yet</h3>
          <p>Start building your community by creating your first event. Events help bring people together and make a lasting impact.</p>
          <button 
            className={styles.emptyActionButton}
            onClick={() => setIsCreating(true)}
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className={`${styles.cardGrid} ${loading ? styles.loading : ''}`}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={setEditingEvent}
              onDelete={deleteEvent}
            />
          ))}
        </div>
      )}

      {editingEvent && (
        <EventEditor
          event={editingEvent}
          onSave={handleEditEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {isCreating && (
        <EventEditor
          onSave={handleCreateEvent}
          onClose={() => setIsCreating(false)}
        />
      )}
    </div>
  );
}