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
} from '@nestjs/common';
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
  create(@Body() createCauseDto: CreateCauseDto) {
    return this.causesService.create(createCauseDto);
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCauseDto: UpdateCauseDto,
  ) {
    return this.causesService.update(id, updateCauseDto);
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
