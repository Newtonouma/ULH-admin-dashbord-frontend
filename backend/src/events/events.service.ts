import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { getSupabaseStorage } from '../storage/supabase-storage.service';

@Injectable()
export class EventsService {
  private supabaseStorage: any;

  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {
    // Initialize Supabase storage service
    this.supabaseStorage = getSupabaseStorage();
  }

  async findAll(): Promise<Event[]> {
    try {
      return await this.eventRepo.find();
    } catch (error) {
      console.error('Events findAll error:', error);
      throw new Error(
        'Failed to fetch events: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(
    data: CreateEventDto,
    files?: Express.Multer.File[],
    existingImages: string[] = []
  ): Promise<Event> {
    try {
      let imageUrls: string[] = [...existingImages];

      // Upload new files if provided
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
          const result = await this.supabaseStorage.uploadFile(file.buffer, fileName, 'events');
          return result.url;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const event = this.eventRepo.create({
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        imageUrls: imageUrls,
      });

      return await this.eventRepo.save(event);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  async update(
    id: string,
    data: UpdateEventDto,
    files?: Express.Multer.File[],
    existingImages: string[] = [],
    imagesToDelete: string[] = []
  ): Promise<Event> {
    try {
      const event = await this.findOne(id);

      // Start with existing images from the event
      let currentImages = event.imageUrls || [];

      // Remove images marked for deletion
      if (imagesToDelete.length > 0) {
        // Delete from Supabase storage
        for (const imageUrl of imagesToDelete) {
          try {
            await this.supabaseStorage.deleteFile(imageUrl);
          } catch (error) {
            console.warn('Failed to delete image from storage:', imageUrl, error);
          }
        }
        
        // Remove from current images array
        currentImages = currentImages.filter(url => !imagesToDelete.includes(url));
      }

      // Combine with existing images that weren't deleted
      let finalImages = [...currentImages];

      // Upload new files if provided
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
          const result = await this.supabaseStorage.uploadFile(file.buffer, fileName, 'events');
          return result.url;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...newImageUrls];
      }

      // Update event data
      if (data.title) event.title = data.title;
      if (data.description) event.description = data.description;
      if (data.location) event.location = data.location;
      if (data.date) event.date = new Date(data.date);
      if (data.startTime) event.startTime = data.startTime;
      if (data.endTime) event.endTime = data.endTime;
      event.imageUrls = finalImages;

      return await this.eventRepo.save(event);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const event = await this.findOne(id);

      // Delete associated images from Supabase storage
      if (event.imageUrls && event.imageUrls.length > 0) {
        for (const imageUrl of event.imageUrls) {
          try {
            await this.supabaseStorage.deleteFile(imageUrl);
          } catch (error) {
            console.warn('Failed to delete image from storage during event deletion:', imageUrl, error);
          }
        }
      }

      await this.eventRepo.remove(event);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }
}
