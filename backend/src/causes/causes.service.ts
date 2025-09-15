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

@Injectable()
export class CausesService {
  constructor(
    @InjectRepository(Cause)
    private causesRepository: Repository<Cause>,
  ) {}

  async create(createCauseDto: CreateCauseDto): Promise<Cause> {
    try {
      const cause = this.causesRepository.create({
        title: createCauseDto.title,
        goal: createCauseDto.goal,
        category: createCauseDto.category,
        description: createCauseDto.description,
        imageUrl: createCauseDto.imageUrl,
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

  async update(id: string, updateCauseDto: UpdateCauseDto): Promise<Cause> {
    try {
      const cause = await this.findOne(id);

      // Update basic cause properties
      Object.assign(cause, {
        title: updateCauseDto.title,
        goal: updateCauseDto.goal,
        category: updateCauseDto.category,
        description: updateCauseDto.description,
        imageUrl: updateCauseDto.imageUrl,
      });

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
