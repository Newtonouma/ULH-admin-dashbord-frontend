import { createClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  serviceKey: string;
  bucketName: string;
}

class SupabaseStorageService {
  private client: any;
  private bucketName: string;

  constructor(config: SupabaseConfig) {
    this.client = createClient(config.url, config.serviceKey);
    this.bucketName = config.bucketName;
  }

  async uploadFile(
    file: Buffer | Uint8Array | File,
    fileName: string,
    folder: string = ''
  ): Promise<{ url: string; path: string }> {
    try {
      const fullPath = folder ? `${folder}/${fileName}` : fileName;
      
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .upload(fullPath, file, {
          upsert: false, // Don't overwrite existing files
          contentType: this.getContentType(fileName)
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get the public URL
      const { data: urlData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(fullPath);

      return {
        url: urlData.publicUrl,
        path: fullPath
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; filename: string }>,
    folder: string = ''
  ): Promise<Array<{ url: string; path: string; originalName: string }>> {
    const uploads = files.map(async (file) => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomId}-${file.filename}`;
      
      const result = await this.uploadFile(file.buffer, fileName, folder);
      return {
        ...result,
        originalName: file.filename
      };
    });

    return Promise.all(uploads);
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await this.client.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<boolean> {
    try {
      const { error } = await this.client.storage
        .from(this.bucketName)
        .remove(filePaths);

      if (error) {
        console.error('Bulk delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Bulk delete failed:', error);
      return false;
    }
  }

  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml'
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  // Utility method to extract file path from Supabase URL
  extractFilePathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.indexOf(this.bucketName);
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      
      return null;
    } catch {
      return null;
    }
  }
}

// Singleton instance
let supabaseStorage: SupabaseStorageService | null = null;

export const getSupabaseStorage = (): SupabaseStorageService => {
  if (!supabaseStorage) {
    const config: SupabaseConfig = {
      url: process.env.SUPABASE_URL || '',
      serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
      bucketName: process.env.SUPABASE_BUCKET_NAME || 'uploads'
    };

    if (!config.url || !config.serviceKey) {
      throw new Error('Supabase configuration is missing. Please check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
    }

    supabaseStorage = new SupabaseStorageService(config);
  }

  return supabaseStorage;
};

export default SupabaseStorageService;