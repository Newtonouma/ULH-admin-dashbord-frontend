import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
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
  create(@Body() data: CreateGalleryDto): Promise<Gallery> {
    return this.galleryService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateGalleryDto,
  ): Promise<Gallery> {
    return this.galleryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.galleryService.remove(id);
  }
}
