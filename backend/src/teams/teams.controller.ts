import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './team.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard, AdminGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async create(
    @Body() createTeamDto: any, // Using any because FormData doesn't work well with DTO validation
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      console.log('Teams POST - Body received:', {
        name: createTeamDto.name,
        bio: createTeamDto.bio,
        contact: createTeamDto.contact,
        email: createTeamDto.email,
        existingImages: createTeamDto.existingImages
      });
      console.log('Teams POST - Files received:', files.length);

      // Parse FormData fields
      const parsedDto: CreateTeamDto = {
        name: createTeamDto.name,
        description: createTeamDto.bio || '', // Ensure description is never null/undefined
        contact: createTeamDto.contact,
        email: createTeamDto.email,
        facebook: createTeamDto.facebook,
        tiktok: createTeamDto.tiktok,
        twitter: createTeamDto.twitter,
        linkedin: createTeamDto.linkedin,
      };

      // Parse existing images if provided
      let existingImages: string[] = [];
      if (createTeamDto.existingImages) {
        try {
          existingImages = JSON.parse(createTeamDto.existingImages);
        } catch (e) {
          console.warn('Failed to parse existingImages:', e);
        }
      }

      return await this.teamsService.create(parsedDto, files, existingImages);
    } catch (error) {
      console.error('Error creating team:', error);
      throw new BadRequestException('Failed to create team');
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeamDto: any, // Using any because FormData doesn't work well with DTO validation
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      // Parse FormData fields
      const parsedDto: UpdateTeamDto = {};
      if (updateTeamDto.name) parsedDto.name = updateTeamDto.name;
      if (updateTeamDto.bio !== undefined) parsedDto.description = updateTeamDto.bio || ''; // Ensure description is never null/undefined
      if (updateTeamDto.contact) parsedDto.contact = updateTeamDto.contact;
      if (updateTeamDto.email) parsedDto.email = updateTeamDto.email;
      if (updateTeamDto.facebook) parsedDto.facebook = updateTeamDto.facebook;
      if (updateTeamDto.tiktok) parsedDto.tiktok = updateTeamDto.tiktok;
      if (updateTeamDto.twitter) parsedDto.twitter = updateTeamDto.twitter;
      if (updateTeamDto.linkedin) parsedDto.linkedin = updateTeamDto.linkedin;

      // Parse existing images if provided
      let existingImages: string[] = [];
      if (updateTeamDto.existingImages) {
        try {
          existingImages = JSON.parse(updateTeamDto.existingImages);
        } catch (e) {
          console.warn('Failed to parse existingImages:', e);
        }
      }

      // Parse images to delete if provided
      let imagesToDelete: string[] = [];
      if (updateTeamDto.imagesToDelete) {
        try {
          imagesToDelete = JSON.parse(updateTeamDto.imagesToDelete);
        } catch (e) {
          console.warn('Failed to parse imagesToDelete:', e);
        }
      }

      return await this.teamsService.update(id, parsedDto, files, existingImages, imagesToDelete);
    } catch (error) {
      console.error('Error updating team:', error);
      throw new BadRequestException('Failed to update team');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.teamsService.remove(id);
  }
}
