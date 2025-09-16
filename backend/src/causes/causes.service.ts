import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cause } from './cause.entity';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { getSupabaseStorage } from '../storage/supabase-storage.service';

@Injectable()
export class CausesService {
  constructor(
    @InjectRepository(Cause)
    private causesRepository: Repository<Cause>,
  ) {}

  async create(
    createCauseDto: CreateCauseDto,
    files: Express.Multer.File[] = [],
    existingImages: string[] = [],
  ): Promise<Cause> {
    try {
      let imageUrls: string[] = [...existingImages];

      // Upload new files to Supabase
      if (files && files.length > 0) {
        const storage = getSupabaseStorage();
        const fileData = files.map((file) => ({
          buffer: file.buffer,
          filename: file.originalname,
        }));

        const uploadResults = await storage.uploadMultipleFiles(
          fileData,
          'causes',
        );
        const newImageUrls = uploadResults.map((result) => result.url);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const cause = this.causesRepository.create({
        title: createCauseDto.title,
        goal: createCauseDto.goal,
        category: createCauseDto.category,
        description: createCauseDto.description,
        imageUrls: imageUrls,
      });

      const savedCause = await this.causesRepository.save(cause);
      return savedCause;
    } catch (error) {
      throw new BadRequestException(
        'Failed to create cause: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAll(): Promise<Cause[]> {
    try {
      return await this.causesRepository.find();
    } catch (error) {
      console.error('Causes findAll error:', error);
      throw new BadRequestException(
        'Failed to fetch causes: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string): Promise<Cause> {
    try {
      const cause = await this.causesRepository.findOne({
        where: { id },
      });

      if (!cause) {
        throw new NotFoundException(`Cause with ID ${id} not found`);
      }

      return cause;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to fetch cause: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(
    id: string,
    updateCauseDto: UpdateCauseDto,
    files: Express.Multer.File[] = [],
    existingImages: string[] = [],
    imagesToDelete: string[] = [],
  ): Promise<Cause> {
    try {
      const cause = await this.findOne(id);
      const storage = getSupabaseStorage();

      // Delete specified images from Supabase
      if (imagesToDelete.length > 0) {
        const pathsToDelete = imagesToDelete
          .map((url) => storage.extractFilePathFromUrl(url))
          .filter((path) => path !== null);

        if (pathsToDelete.length > 0) {
          await storage.deleteMultipleFiles(pathsToDelete);
        }
      }

      // Start with existing images (excluding those to be deleted)
      let imageUrls: string[] = existingImages;

      // Upload new files to Supabase
      if (files && files.length > 0) {
        const fileData = files.map((file) => ({
          buffer: file.buffer,
          filename: file.originalname,
        }));

        const uploadResults = await storage.uploadMultipleFiles(
          fileData,
          'causes',
        );
        const newImageUrls = uploadResults.map((result) => result.url);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update cause properties
      const updateData: Partial<Cause> = {
        imageUrls: imageUrls,
      };

      if (updateCauseDto.title !== undefined) {
        updateData.title = updateCauseDto.title;
      }
      if (updateCauseDto.goal !== undefined) {
        updateData.goal = updateCauseDto.goal;
      }
      if (updateCauseDto.category !== undefined) {
        updateData.category = updateCauseDto.category;
      }
      if (updateCauseDto.description !== undefined) {
        updateData.description = updateCauseDto.description;
      }

      Object.assign(cause, updateData);

      return await this.causesRepository.save(cause);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to update cause: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const cause = await this.findOne(id);
      
      // Delete all associated images from Supabase
      if (cause.imageUrls && cause.imageUrls.length > 0) {
        const storage = getSupabaseStorage();
        const pathsToDelete = cause.imageUrls
          .map((url) => storage.extractFilePathFromUrl(url))
          .filter((path) => path !== null);

        if (pathsToDelete.length > 0) {
          await storage.deleteMultipleFiles(pathsToDelete);
        }
      }

      await this.causesRepository.remove(cause);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to delete cause: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
