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
  getAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTeamDto): Promise<Team> {
    return this.teamsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.teamsService.remove(id);
  }
}
