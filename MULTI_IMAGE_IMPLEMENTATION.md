# Universal Lighthouse Application - Multi-Image Upload Implementation

## Overview

This implementation adds support for multiple image uploads across all entities (Causes, Events, Teams, Gallery) with the following features:

- **Frontend**: FormData-based uploads with drag-and-drop interface
- **Backend**: Supabase storage integration with automatic file management
- **Database**: Array-based image URL storage
- **UI**: Image preview, deletion, and management

## Key Changes

### Frontend Changes
1. **Updated Types**: Changed `imageUrl` to `imageUrls: string[]` across all entities
2. **New Component**: `MultipleImageUpload` component with drag-and-drop, preview, and delete functionality
3. **FormData Support**: Updated API client to handle both JSON and FormData requests
4. **Enhanced UI**: Cards show primary image with count indicator for additional images

### Backend Changes
1. **Supabase Integration**: New `SupabaseStorageService` for file upload/delete operations
2. **Database Schema**: Updated entities to use `imageUrls` array instead of single `imageUrl`
3. **Controller Updates**: FormData parsing and file handling in all CRUD endpoints
4. **Service Logic**: Automatic file cleanup on delete operations

### Database Migration
Run the migration to update the `causes` table:
```bash
npm run migration:run
```

## Configuration Required

### Environment Variables
Add these to your backend `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
SUPABASE_BUCKET_NAME=uploads
```

### Supabase Setup
1. Create a new bucket named `uploads` in your Supabase storage
2. Set bucket to public if you want direct access to images
3. Configure RLS policies as needed

## Features

### Multi-Image Upload
- Drag and drop multiple images
- Preview all images before upload
- Upload up to 10 images per entity
- Automatic file naming with timestamps

### Image Management
- Delete individual images when editing
- Maintain existing images while adding new ones
- Automatic cleanup of orphaned files
- Support for various image formats (JPG, PNG, WebP, etc.)

### Error Handling
- Client-side validation
- Server-side file processing errors
- Graceful fallbacks for missing images
- User-friendly error messages

## Usage

### Creating a Cause with Images
1. Fill out the cause form
2. Drag and drop images or click to select
3. Preview images before saving
4. Submit form - images are uploaded to Supabase

### Editing Images
1. Existing images are shown with "Existing" badge
2. Click X to mark images for deletion
3. Add new images alongside existing ones
4. Save to apply changes

### API Integration
The backend now accepts FormData with:
- Form fields: `title`, `description`, `category`, `goal`
- File uploads: `images` (multiple files)
- Metadata: `existingImages`, `imagesToDelete` (JSON arrays)

## Testing

To test the complete flow:
1. Configure Supabase credentials
2. Run the database migration
3. Start both frontend and backend
4. Create a new cause with multiple images
5. Edit the cause to add/remove images
6. Verify images are properly stored in Supabase

## Notes

- Images are stored in `causes/` folder in Supabase bucket
- File names include timestamp and random ID for uniqueness
- Deleted images are automatically removed from Supabase
- The first image in the array is used as the primary display image
- All endpoints maintain backward compatibility with existing data