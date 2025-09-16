import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('events')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async create(
    @Body() createEventDto: any, // Using any because FormData doesn't work well with DTO validation
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      // Parse FormData fields
      const parsedDto: CreateEventDto = {
        title: createEventDto.title,
        description: createEventDto.description,
        date: createEventDto.date,
        startTime: createEventDto.startTime,
        endTime: createEventDto.endTime,
        location: createEventDto.location,
      };

      // Debug: Log the received data
      console.log('Received FormData fields:', {
        title: createEventDto.title,
        description: createEventDto.description,
        date: createEventDto.date,
        startTime: createEventDto.startTime,
        endTime: createEventDto.endTime,
        location: createEventDto.location,
      });
      console.log('Parsed DTO:', parsedDto);
      console.log('Files received:', files?.length || 0);

      // Parse existing images if provided
      let existingImages: string[] = [];
      if (createEventDto.existingImages) {
        try {
          existingImages = JSON.parse(createEventDto.existingImages);
        } catch (e) {
          console.warn('Failed to parse existingImages:', e);
        }
      }
      
      console.log('Existing images:', existingImages);

      return await this.eventsService.create(parsedDto, files, existingImages);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new BadRequestException('Failed to create event');
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: any, // Using any because FormData doesn't work well with DTO validation
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      // Parse FormData fields
      const parsedDto: UpdateEventDto = {};
      if (updateEventDto.title) parsedDto.title = updateEventDto.title;
      if (updateEventDto.description) parsedDto.description = updateEventDto.description;
      if (updateEventDto.date) parsedDto.date = updateEventDto.date;
      if (updateEventDto.startTime) parsedDto.startTime = updateEventDto.startTime;
      if (updateEventDto.endTime) parsedDto.endTime = updateEventDto.endTime;
      if (updateEventDto.location) parsedDto.location = updateEventDto.location;

      // Parse existing images if provided
      let existingImages: string[] = [];
      if (updateEventDto.existingImages) {
        try {
          existingImages = JSON.parse(updateEventDto.existingImages);
        } catch (e) {
          console.warn('Failed to parse existingImages:', e);
        }
      }

      // Parse images to delete if provided
      let imagesToDelete: string[] = [];
      if (updateEventDto.imagesToDelete) {
        try {
          imagesToDelete = JSON.parse(updateEventDto.imagesToDelete);
        } catch (e) {
          console.warn('Failed to parse imagesToDelete:', e);
        }
      }

      return await this.eventsService.update(id, parsedDto, files, existingImages, imagesToDelete);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new BadRequestException('Failed to update event');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.eventsService.remove(id);
  }
}
