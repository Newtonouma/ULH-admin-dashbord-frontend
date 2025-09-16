import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Gallery } from './gallery.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('gallery')
@UseGuards(JwtAuthGuard, AdminGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  getAll(): Promise<Gallery[]> {
    return this.galleryService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Gallery> {
    return this.galleryService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 20))
  async create(
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Gallery> {
    console.log('Gallery POST - Body received:', {
      title: data.title,
      description: data.description,
      type: data.type,
      existingImages: data.existingImages,
    });
    console.log('Gallery POST - Files received:', files?.length || 0);

    try {
      const createData: CreateGalleryDto = {
        title: data.title,
        description: data.description,
        type: data.type || 'photo',
        imageUrls: [],
      };

      return this.galleryService.create(createData, files || [], data.existingImages ? JSON.parse(data.existingImages) : []);
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw new BadRequestException('Failed to create gallery item');
    }
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 20))
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Gallery> {
    console.log('Gallery PATCH - Body received:', {
      title: data.title,
      description: data.description,
      type: data.type,
      existingImages: data.existingImages,
    });
    console.log('Gallery PATCH - Files received:', files?.length || 0);

    try {
      const updateData: UpdateGalleryDto = {
        title: data.title,
        description: data.description,
        type: data.type,
      };

      return this.galleryService.update(id, updateData, files || [], data.existingImages ? JSON.parse(data.existingImages) : []);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw new BadRequestException('Failed to update gallery item');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.galleryService.remove(id);
  }
}
