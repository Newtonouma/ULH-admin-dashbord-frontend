import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { getSupabaseStorage } from '../storage/supabase-storage.service';

@Injectable()
export class GalleryService {
  private supabaseStorage: any;

  constructor(
    @InjectRepository(Gallery)
    private galleryRepo: Repository<Gallery>,
  ) {
    // Use the same storage service as other modules
    this.supabaseStorage = getSupabaseStorage();
  }

  findAll(): Promise<Gallery[]> {
    return this.galleryRepo.find();
  }

  async findOne(id: string): Promise<Gallery> {
    const item = await this.galleryRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    return item;
  }

  async create(
    data: CreateGalleryDto,
    files: Express.Multer.File[] = [],
    existingImages: string[] = [],
  ): Promise<Gallery> {
    try {
      console.log('Gallery Service - Create called with:', {
        data,
        filesCount: files.length,
        existingImagesCount: existingImages.length
      });

      // Upload new files to Supabase
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        console.log('Gallery Service - Processing file:', file.originalname, file.size);
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.originalname.split('.').pop()}`;
        const uploadResult = await this.supabaseStorage.uploadFile(
          file.buffer,
          fileName,
        );
        
        console.log('Gallery Service - Upload result:', uploadResult);
        if (uploadResult.url) {
          uploadedUrls.push(uploadResult.url);
        }
      }

      // Combine existing images with new uploads
      const allImageUrls = [...existingImages, ...uploadedUrls];
      console.log('Gallery Service - Final imageUrls:', allImageUrls);

      const galleryData = {
        ...data,
        imageUrls: allImageUrls,
      };

      console.log('Gallery Service - Creating gallery with data:', galleryData);
      const item = this.galleryRepo.create(galleryData);
      return this.galleryRepo.save(item);
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  async update(
    id: string,
    data: UpdateGalleryDto,
    files: Express.Multer.File[] = [],
    existingImages: string[] = [],
  ): Promise<Gallery> {
    try {
      const item = await this.findOne(id);

      // Upload new files to Supabase
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.originalname.split('.').pop()}`;
        const uploadResult = await this.supabaseStorage.uploadFile(
          file.buffer,
          fileName,
        );
        
        if (uploadResult.url) {
          uploadedUrls.push(uploadResult.url);
        }
      }

      // Combine existing images with new uploads
      const allImageUrls = [...existingImages, ...uploadedUrls];

      // Update the item
      Object.assign(item, {
        ...data,
        imageUrls: allImageUrls,
      });

      return this.galleryRepo.save(item);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.galleryRepo.remove(item);
  }
}
