'use client';

import { useState } from 'react';
import { TeamMember } from '../../../types';
import FileInput from '@/components/FileInput';
import styles from './TeamEditor.module.css';

interface TeamFormData {
  name: string;
  bio: string;
  contact: string;
  email: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  tiktok: string;
  formData?: FormData;
  existingImages?: string[];
}

interface TeamEditorProps {
  team?: TeamMember;
  onSave: (data: TeamFormData) => Promise<boolean>;
  onClose: () => void;
}

export default function TeamEditor({ team, onSave, onClose }: TeamEditorProps) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    bio: team?.bio || '',
    contact: team?.contact?.phone || '',
    email: team?.contact?.email || '',
    facebook: team?.socialMedia?.facebook || '',
    linkedin: team?.socialMedia?.linkedin || '',
    twitter: team?.socialMedia?.twitter || '',
    tiktok: team?.socialMedia?.instagram || '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(team?.imageUrls || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for backend
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('facebook', formData.facebook);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('twitter', formData.twitter);
      formDataToSend.append('tiktok', formData.tiktok);
      
      // Add existing images
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      
      // Add new files
      selectedFiles.forEach((file) => {
        formDataToSend.append(`images`, file);
      });

      // For the onSave callback, create the expected object
      const backendData: TeamFormData = {
        name: formData.name,
        bio: formData.bio,
        contact: formData.contact,
        email: formData.email,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        tiktok: formData.tiktok,
        formData: formDataToSend, // Pass FormData for the backend
        existingImages: existingImages,
      };
      
      const success = await onSave(backendData);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError('Failed to save team member. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.editorHeader}>
          <h2>{team ? 'Edit Team Member' : 'Add New Team Member'}</h2>
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

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter team member's name"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio" className={styles.label}>Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              placeholder="Enter team member's bio"
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Team Member Images</label>
            <FileInput
              onFilesSelect={handleFileChange}
              accept="image/*"
              multiple={true}
              maxFiles={5}
            />
            
            {/* Show existing images */}
            {existingImages.length > 0 && (
              <div className={styles.existingImages}>
                <h4>Current Images:</h4>
                <div className={styles.imagePreviewGrid}>
                  {existingImages.map((url, index) => (
                    <div key={index} className={styles.imagePreviewItem}>
                      <img src={url} alt={`Team member ${index + 1}`} className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contact" className={styles.label}>Contact Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact number (optional)"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address (optional)"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="linkedin" className={styles.label}>LinkedIn URL</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="Enter LinkedIn profile URL (optional)"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="twitter" className={styles.label}>Twitter URL</label>
            <input
              type="url"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="Enter Twitter profile URL (optional)"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="facebook" className={styles.label}>Facebook URL</label>
            <input
              type="url"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="Enter Facebook profile URL (optional)"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tiktok" className={styles.label}>TikTok URL</label>
            <input
              type="url"
              id="tiktok"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              placeholder="Enter TikTok profile URL (optional)"
              className={styles.input}
            />
          </div>

          <div className={styles.editorActions}>
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
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Team Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}