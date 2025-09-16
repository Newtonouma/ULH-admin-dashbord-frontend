'use client';

import { useState, useEffect } from 'react';
import { GalleryItem, CreateGalleryItemData } from '../../../types';
import FileInput from '@/components/FileInput';
import styles from './GalleryEditor.module.css';

interface GalleryFormData {
  title: string;
  description: string;
  type: 'photo' | 'video';
  formData?: FormData;
  existingImages?: string[];
}

interface GalleryEditorProps {
  item?: GalleryItem;
  onSave: (data: GalleryFormData) => Promise<boolean>;
  onClose: () => void;
}

export default function GalleryEditor({ item, onSave, onClose }: GalleryEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'photo' as 'photo' | 'video',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'photo',
      });
      setExistingImages(item.imageUrls || []);
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'photo',
      });
      setExistingImages([]);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleExistingImageRemove = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      
      // Add existing images
      existingImages.forEach((url, index) => {
        formDataToSend.append(`existingImages[${index}]`, url);
      });
      
      // Add new files
      selectedFiles.forEach((file) => {
        formDataToSend.append(`images`, file);
      });

      // For the onSave callback, create the expected object
      const backendData: GalleryFormData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        formData: formDataToSend, // Pass FormData for the backend
        existingImages: existingImages,
      };
      
      const success = await onSave(backendData);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError('Failed to save gallery item. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.editorHeader}>
          <h2>{item ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
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
        </div>        <form onSubmit={handleSubmit} className={styles.editorForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a title for this gallery item"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter a description for this gallery item"
              rows={3}
              className={styles.formTextarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className={styles.formSelect}
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Gallery Images</label>
            <div className={styles.imageUploadContainer}>
              <FileInput
                onFilesSelect={handleFilesSelect}
                existingImages={existingImages}
                onExistingImageRemove={handleExistingImageRemove}
                multiple={true}
                maxFiles={10}
                accept="image/*"
                disabled={isSubmitting}
              />
            </div>
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
                item ? 'Update Item' : 'Create Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}