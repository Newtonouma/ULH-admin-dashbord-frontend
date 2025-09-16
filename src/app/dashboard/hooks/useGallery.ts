import { useState, useEffect } from 'react';
import { GalleryApi } from '../../../services/api';
import { GalleryItem, CreateGalleryItemData, UpdateGalleryItemData } from '../../../types';

export function useGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GalleryApi.getAll();
      setGalleryItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gallery items';
      setError(errorMessage);
      console.error('Error fetching gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGalleryItem = async (
    itemData: Partial<GalleryItem>,
    files: File[] = []
  ): Promise<boolean> => {
    try {
      setError(null);
      
      const formData = new FormData();
      formData.append('title', itemData.title || '');
      formData.append('description', itemData.description || '');
      formData.append('type', itemData.type || 'photo');
      
      // Add files to FormData
      files.forEach((file) => {
        formData.append('images', file);
      });

      const newItem = await GalleryApi.create(formData);
      setGalleryItems(prev => [...prev, newItem]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create gallery item';
      setError(errorMessage);
      console.error('Error creating gallery item:', err);
      return false;
    }
  };

  const updateGalleryItem = async (
    id: string,
    itemData: Partial<GalleryItem>,
    files: File[] = [],
    existingImages: string[] = []
  ): Promise<boolean> => {
    try {
      setError(null);
      
      const formData = new FormData();
      if (itemData.title !== undefined) formData.append('title', itemData.title);
      if (itemData.description !== undefined) formData.append('description', itemData.description);
      if (itemData.type !== undefined) formData.append('type', itemData.type);
      
      // Add existing images
      existingImages.forEach((imageUrl) => {
        formData.append('existingImages', imageUrl);
      });
      
      // Add new files
      files.forEach((file) => {
        formData.append('images', file);
      });

      const updatedItem = await GalleryApi.update(id, formData);
      setGalleryItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update gallery item';
      setError(errorMessage);
      console.error('Error updating gallery item:', err);
      return false;
    }
  };

  const deleteGalleryItem = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await GalleryApi.delete(id);
      setGalleryItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery item';
      setError(errorMessage);
      console.error('Error deleting gallery item:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return {
    galleryItems,
    loading,
    error,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    refetch: fetchGalleryItems,
  };
} 