'use client';

import { useState } from 'react';
import { GalleryItem } from '../../../types';
import { useGallery } from '../hooks/useGallery';
import GalleryCard from './GalleryCard';
import GalleryEditor from './GalleryEditor';
import styles from './GalleryPanel.module.css';

interface GalleryFormData {
  title: string;
  description: string;
  type: 'photo' | 'video';
  formData?: FormData;
  existingImages?: string[];
}

export default function GalleryPanel() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { galleryItems, loading, error, createGalleryItem, updateGalleryItem, deleteGalleryItem, refetch } = useGallery();

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      const success = await deleteGalleryItem(id);
      if (success) {
        // Item will be removed from galleryItems by the hook
        console.log('Gallery item deleted successfully');
      }
    }
  };

  const handleSave = async (data: GalleryFormData): Promise<boolean> => {
    let success: boolean;
    
    // Extract data and files from the GalleryFormData
    const galleryData = {
      title: data.title,
      description: data.description,
      type: data.type as 'photo' | 'video',
      imageUrls: data.existingImages || []
    };
    
    // Extract files from FormData
    const files: File[] = [];
    if (data.formData) {
      const formDataFiles = data.formData.getAll('images') as File[];
      files.push(...formDataFiles);
    }
    const existingImages: string[] = data.existingImages || [];
    
    if (selectedItem && selectedItem.id) {
      success = await updateGalleryItem(selectedItem.id, galleryData, files, existingImages);
      if (success) {
        // Refetch data to update the UI
        await refetch();
      }
    } else {
      success = await createGalleryItem(galleryData, files);
      if (success) {
        // Refetch data to update the UI
        await refetch();
      }
    }
    return success;
  };

  if (loading) {
    return (
      <div className={styles.galleryPanel}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading gallery items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.galleryPanel}>
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
    <div className={styles.galleryPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerContent}>
          <h2>Gallery Management</h2>
          <p className={styles.subtitle}>Create and manage your gallery items</p>
        </div>
        <button
          className={styles.addButton}
          onClick={handleCreate}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add New Item
        </button>
      </div>

      {galleryItems.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>No Gallery Items Yet</h3>
          <p>Get started by adding your first gallery item</p>
          <button
            className={styles.addButton}
            onClick={handleCreate}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add First Item
          </button>
        </div>
      ) : (
        <div className={styles.galleryGrid}>
          {galleryItems.map((item: GalleryItem) => (
            <GalleryCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isEditorOpen && (
        <GalleryEditor
          item={selectedItem}
          onSave={handleSave}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedItem(undefined);
          }}
        />
      )}
    </div>
  );
}