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

  const createGalleryItem = async (itemData: Partial<GalleryItem>): Promise<boolean> => {
    try {
      setError(null);
      const createData: CreateGalleryItemData = {
        title: itemData.title || '',
        description: itemData.description || '',
        imageUrl: itemData.imageUrl || '',
        type: itemData.type || 'photo',
      };
      
      const newItem = await GalleryApi.create(createData);
      setGalleryItems(prev => [...prev, newItem]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create gallery item';
      setError(errorMessage);
      console.error('Error creating gallery item:', err);
      return false;
    }
  };

  const updateGalleryItem = async (id: string, itemData: Partial<GalleryItem>): Promise<boolean> => {
    try {
      setError(null);
      const updateData: UpdateGalleryItemData = {
        title: itemData.title,
        description: itemData.description,
        imageUrl: itemData.imageUrl,
        type: itemData.type,
      };
      
      const updatedItem = await GalleryApi.update(id, updateData);
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