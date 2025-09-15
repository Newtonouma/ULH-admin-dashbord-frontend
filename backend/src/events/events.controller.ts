import { EventsService } from './events.service';
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
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('events')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateEventDto) {
    return this.eventsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateEventDto) {
    return this.eventsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
