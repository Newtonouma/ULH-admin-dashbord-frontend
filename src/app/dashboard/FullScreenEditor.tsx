import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useState } from 'react';
import { Cause } from '../../types';
import MultipleImageUpload from '@/components/MultipleImageUpload';

interface FullScreenEditorProps {
  cause?: Cause;
  onSave: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export default function FullScreenEditor({ cause, onSave, onClose }: FullScreenEditorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(cause?.title || '');
  const [category, setCategory] = useState(cause?.category || '');
  const [goal, setGoal] = useState(cause?.goal?.toString() || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: cause?.description || '',
  });

  const handleImageFilesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleDeleteExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Parse and validate goal as number
      const goalValue = parseFloat(goal);
      if (isNaN(goalValue) || goalValue < 0) {
        throw new Error('Goal must be a valid number greater than or equal to 0');
      }

      // Validate required fields
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!category) {
        throw new Error('Category is required');
      }
      if (!goalValue) {
        throw new Error('Goal amount is required');
      }
      const description = editor?.getHTML() || '';
      if (!description) {
        throw new Error('Description is required');
      }

      // Create FormData
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('goal', goalValue.toString());
      formData.append('description', description);
      
      // Add existing images (not deleted)
      if (cause?.imageUrls) {
        const remainingImages = cause.imageUrls.filter(url => !imagesToDelete.includes(url));
        formData.append('existingImages', JSON.stringify(remainingImages));
      } else {
        // For new causes, send an empty array
        formData.append('existingImages', JSON.stringify([]));
      }
      
      // Add images to delete
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      // Add new image files
      imageFiles.forEach((file) => {
        formData.append(`images`, file);
      });

      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cause');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="fullscreen-editor">
      <div className="editor-header">
        <h2>{cause ? 'Edit Cause' : 'Create New Cause'}</h2>
        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Environment">Environment</option>
            <option value="Social">Social</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Goal Amount</label>
          <input
            type="number"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
            placeholder="Enter goal amount"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Cause Images</label>
          <MultipleImageUpload
            onFilesChange={handleImageFilesChange}
            existingImages={cause?.imageUrls}
            onDeleteExisting={handleDeleteExistingImage}
            maxFiles={10}
            accept="image/*"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <div className="editor-toolbar">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'is-active' : ''}
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'is-active' : ''}
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor?.isActive('heading') ? 'is-active' : ''}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive('bulletList') ? 'is-active' : ''}
            >
              Bullet List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive('orderedList') ? 'is-active' : ''}
            >
              Numbered List
            </button>
            <button type="button" onClick={addLink}>
              Add Link
            </button>
            <button type="button" onClick={addImage}>
              Add Image
            </button>
          </div>
          <div className="editor-content">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="editor-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (cause ? 'Save Changes' : 'Create Cause')}
          </button>
        </div>
      </form>
    </div>
  );
}