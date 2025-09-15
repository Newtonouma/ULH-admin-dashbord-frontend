import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp', 
  'image/gif'
];

export async function POST(request: Request) {
  try {
    console.log('Upload API: Starting file upload...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('Upload API: File received:', file ? file.name : 'no file');
    
    if (!file) {
      console.log('Upload API: No file in request');
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    console.log('Upload API: Validating file type:', file.type);
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('Upload API: Invalid file type');
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    console.log('Upload API: Validating file size:', file.size, 'vs max:', MAX_FILE_SIZE);
    if (file.size > MAX_FILE_SIZE) {
      console.log('Upload API: File too large');
      return NextResponse.json(
        { message: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('Upload API: File validation passed');
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Setup paths
    const publicDir = join(process.cwd(), 'public', 'uploads');
    console.log('Upload API: Upload directory:', publicDir);
    
    // Ensure upload directory exists
    if (!existsSync(publicDir)) {
      console.log('Upload API: Creating upload directory...');
      await mkdir(publicDir, { recursive: true });
    }
    
    // Write file
    const filepath = join(publicDir, filename);
    console.log('Upload API: Writing file to:', filepath);
    await writeFile(filepath, buffer);
    
    const url = `/uploads/${filename}`;
    console.log('Upload API: Upload successful, URL:', url);
    
    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
      provider: 'local'
    });
  } catch (error) {
    console.error('Upload API: Error occurred:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Error uploading file',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}