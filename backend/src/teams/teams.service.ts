import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { getSupabaseStorage } from '../storage/supabase-storage.service';

@Injectable()
export class TeamsService {
  private supabaseStorage: any;

  constructor(
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
  ) {
    // Initialize Supabase storage service
    this.supabaseStorage = getSupabaseStorage();
  }

  async findAll(): Promise<Team[]> {
    try {
      return await this.teamRepo.find();
    } catch (error) {
      console.error('Teams findAll error:', error);
      throw new BadRequestException(
        'Failed to fetch teams: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string): Promise<Team> {
    try {
      const team = await this.teamRepo.findOne({ where: { id } });
      if (!team) {
        throw new NotFoundException(`Team member with ID ${id} not found`);
      }
      return team;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to fetch team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async create(
    data: CreateTeamDto,
    files?: Express.Multer.File[],
    existingImages: string[] = []
  ): Promise<Team> {
    try {
      let imageUrls: string[] = [...existingImages];

      // Upload new files if provided
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.originalname}`;
          const result = await this.supabaseStorage.uploadFile(file.buffer, fileName, 'teams');
          return result.url;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const team = this.teamRepo.create({
        ...data,
        imageUrls: imageUrls,
      });

      return await this.teamRepo.save(team);
    } catch (error) {
      console.error('Error creating team:', error);
      throw new BadRequestException(
        'Failed to create team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(
    id: string,
    data: UpdateTeamDto,
    files?: Express.Multer.File[],
    existingImages: string[] = [],
    imagesToDelete: string[] = []
  ): Promise<Team> {
    try {
      const team = await this.findOne(id);

      // Start with existing images from the team
      let currentImages = team.imageUrls || [];

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
          const result = await this.supabaseStorage.uploadFile(file.buffer, fileName, 'teams');
          return result.url;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...newImageUrls];
      }

      // Update team data
      Object.assign(team, data, {
        imageUrls: finalImages.length > 0 ? finalImages : null,
      });

      return await this.teamRepo.save(team);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating team:', error);
      throw new BadRequestException(
        'Failed to update team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const team = await this.findOne(id);

      // Delete associated images from Supabase storage
      if (team.imageUrls && team.imageUrls.length > 0) {
        for (const imageUrl of team.imageUrls) {
          try {
            await this.supabaseStorage.deleteFile(imageUrl);
          } catch (error) {
            console.warn('Failed to delete image from storage during team deletion:', imageUrl, error);
          }
        }
      }

      await this.teamRepo.remove(team);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting team:', error);
      throw new BadRequestException(
        'Failed to delete team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
