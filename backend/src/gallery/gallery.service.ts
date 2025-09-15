import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepo: Repository<Gallery>,
  ) {}

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

  create(data: CreateGalleryDto): Promise<Gallery> {
    const item = this.galleryRepo.create(data);
    return this.galleryRepo.save(item);
  }

  async update(id: string, data: UpdateGalleryDto): Promise<Gallery> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.galleryRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.galleryRepo.remove(item);
  }
}
