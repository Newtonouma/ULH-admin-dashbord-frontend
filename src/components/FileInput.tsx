'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';

interface FileInputProps {
  onFilesSelect: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  existingImages?: string[];
  onExistingImageRemove?: (index: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function FileInput({
  onFilesSelect,
  onFileRemove,
  multiple = true,
  accept = "image/*",
  maxFiles = 10,
  existingImages = [],
  onExistingImageRemove,
  className = '',
  disabled = false
}: FileInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Limit number of files
    const totalFiles = selectedFiles.length + existingImages.length;
    const availableSlots = maxFiles - totalFiles;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length < files.length) {
      alert(`Maximum ${maxFiles} files allowed. Only the first ${filesToAdd.length} files were selected.`);
    }

    // Create preview URLs
    const newPreviewUrls: string[] = [];
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewUrls.push(e.target?.result as string);
        if (newPreviewUrls.length === filesToAdd.length) {
          setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
      };
      reader.readAsDataURL(file);
    });

    const updatedFiles = [...selectedFiles, ...filesToAdd];
    setSelectedFiles(updatedFiles);
    onFilesSelect(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    onFilesSelect(updatedFiles);
    
    if (onFileRemove) {
      onFileRemove(index);
    }
  };

  const removeExistingImage = (index: number) => {
    if (onExistingImageRemove) {
      onExistingImageRemove(index);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`file-input-container ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden-file-input"
        disabled={disabled}
        aria-label="Select image files"
      />

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="existing-images">
          <h4>Current Images:</h4>
          <div className="image-grid">
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="image-preview">
                <Image
                  src={url}
                  alt={`Existing image ${index + 1}`}
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
                {onExistingImageRemove && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExistingImage(index)}
                    disabled={disabled}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {previewUrls.length > 0 && (
        <div className="selected-images">
          <h4>New Images:</h4>
          <div className="image-grid">
            {previewUrls.map((url, index) => (
              <div key={`new-${index}`} className="image-preview">
                <Image
                  src={url}
                  alt={`New image ${index + 1}`}
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        className="upload-btn"
        onClick={openFileDialog}
        disabled={disabled || (selectedFiles.length + existingImages.length >= maxFiles)}
      >
        {selectedFiles.length + existingImages.length >= maxFiles
          ? `Maximum ${maxFiles} files reached`
          : multiple
          ? 'Select Images'
          : 'Select Image'
        }
      </button>

      <style jsx>{`
        .hidden-file-input {
          display: none;
        }

        .file-input-container {
          margin: 1rem 0;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .image-preview {
          position: relative;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .remove-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .remove-btn:hover {
          background: rgba(255, 0, 0, 1);
        }

        .upload-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .upload-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .upload-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .existing-images h4,
        .selected-images h4 {
          margin: 0.5rem 0;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
}