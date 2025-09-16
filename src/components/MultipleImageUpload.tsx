'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './MultipleImageUpload.module.css';

interface MultipleImageUploadProps {
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
  onDeleteExisting?: (imageUrl: string) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

interface ImagePreview {
  id: string;
  file?: File;
  url: string;
  isExisting?: boolean;
}

export default function MultipleImageUpload({
  onFilesChange,
  existingImages = [],
  onDeleteExisting,
  maxFiles = 10,
  accept = 'image/*',
  className = ''
}: MultipleImageUploadProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>(() => 
    existingImages.map((url, index) => ({
      id: `existing-${index}`,
      url,
      isExisting: true
    }))
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const files = Array.from(fileList);
    const newPreviews: ImagePreview[] = [];
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newPreviews.push({
          id: `new-${Date.now()}-${index}`,
          file,
          url,
          isExisting: false
        });
      }
    });

    setPreviews(prev => {
      const currentFiles = prev.filter(p => !p.isExisting);
      const allPreviews = [...prev.filter(p => p.isExisting), ...currentFiles, ...newPreviews];
      
      // Limit total files
      const limitedPreviews = allPreviews.slice(0, maxFiles);
      
      // Extract only new files for callback
      const allFiles = limitedPreviews
        .filter(p => p.file)
        .map(p => p.file!);
      
      onFilesChange(allFiles);
      return limitedPreviews;
    });
  }, [maxFiles, onFilesChange]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (id: string) => {
    setPreviews(prev => {
      const imageToRemove = prev.find(p => p.id === id);
      
      if (imageToRemove?.isExisting && onDeleteExisting) {
        onDeleteExisting(imageToRemove.url);
      }
      
      const updated = prev.filter(p => p.id !== id);
      
      // Update files for callback
      const currentFiles = updated
        .filter(p => p.file)
        .map(p => p.file!);
      
      onFilesChange(currentFiles);
      
      // Clean up object URLs for removed files
      if (imageToRemove?.file) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      return updated;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview.file) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  const remainingSlots = maxFiles - previews.length;

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />
        
        <div className={styles.dropContent}>
          <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p>Drop images here or click to select</p>
          <p className={styles.hint}>
            {remainingSlots > 0 ? `${remainingSlots} more files allowed` : 'Maximum files reached'}
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className={styles.previewGrid}>
          {previews.map((preview) => (
            <div key={preview.id} className={styles.previewItem}>
              <div className={styles.imageContainer}>
                <Image
                  src={preview.url}
                  alt="Preview"
                  fill
                  className={styles.previewImage}
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeImage(preview.id)}
                  aria-label="Remove image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {preview.isExisting && (
                  <div className={styles.existingBadge}>Existing</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}