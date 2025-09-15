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

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
  ) {}

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

  async create(data: CreateTeamDto): Promise<Team> {
    try {
      const team = this.teamRepo.create(data);
      return await this.teamRepo.save(team);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(id: string, data: UpdateTeamDto): Promise<Team> {
    try {
      const team = await this.findOne(id);
      Object.assign(team, data);
      return await this.teamRepo.save(team);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to update team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const team = await this.findOne(id);
      await this.teamRepo.remove(team);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to delete team member: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}
