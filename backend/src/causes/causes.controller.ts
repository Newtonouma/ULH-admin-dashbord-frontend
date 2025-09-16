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
import { CausesService } from './causes.service';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('causes')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CausesController {
  constructor(private readonly causesService: CausesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async create(
    @Body() createCauseDto: any, // Using any because FormData doesn't work well with DTO validation
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      // Parse FormData fields
      const parsedDto: CreateCauseDto = {
        title: createCauseDto.title,
        description: createCauseDto.description,
        category: createCauseDto.category,
        goal: parseFloat(createCauseDto.goal),
      };

      // Parse existing images if provided
      let existingImages: string[] = [];
      if (createCauseDto.existingImages) {
        try {
          existingImages = JSON.parse(createCauseDto.existingImages);
        } catch (e) {
          // If parsing fails, treat as empty array
          existingImages = [];
        }
      }

      return await this.causesService.create(parsedDto, files, existingImages);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.causesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.causesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCauseDto: any, // Using any because FormData doesn't work well with DTO validation
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      // Parse FormData fields
      const parsedDto: UpdateCauseDto = {};
      
      if (updateCauseDto.title) parsedDto.title = updateCauseDto.title;
      if (updateCauseDto.description) parsedDto.description = updateCauseDto.description;
      if (updateCauseDto.category) parsedDto.category = updateCauseDto.category;
      if (updateCauseDto.goal) parsedDto.goal = parseFloat(updateCauseDto.goal);

      // Parse existing images if provided
      let existingImages: string[] = [];
      if (updateCauseDto.existingImages) {
        try {
          existingImages = JSON.parse(updateCauseDto.existingImages);
        } catch (e) {
          existingImages = [];
        }
      }

      // Parse images to delete if provided
      let imagesToDelete: string[] = [];
      if (updateCauseDto.imagesToDelete) {
        try {
          imagesToDelete = JSON.parse(updateCauseDto.imagesToDelete);
        } catch (e) {
          imagesToDelete = [];
        }
      }

      return await this.causesService.update(id, parsedDto, files, existingImages, imagesToDelete);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.causesService.remove(id);
  }
}

// import { ConfigService } from '@nestjs/config';

// constructor(private configService: ConfigService) {
//   const dbHost = this.configService.get<string>('DATABASE_HOST');
// }
