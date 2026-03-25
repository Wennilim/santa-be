import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import {
  CreateEventConfigDto,
  UpdateEventConfigDto,
} from 'src/dto/create-event-config.dto';
import { EventConfigService } from './event-config.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event-config')
export class EventConfigController {
  constructor(private readonly service: EventConfigService) {}

  // 用户可访问
  @Get()
  @UseGuards(AuthGuard)
  getEventConfig() {
    return this.service.findOne();
  }

  // 管理员
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateEventConfigDto) {
    return this.service.create(dto);
  }

  // 管理员
  @Put()
  @UseGuards(AdminGuard)
  update(@Body() dto: UpdateEventConfigDto) {
    return this.service.update(dto);
  }

  // DEV USED
  // 管理员
  @Delete()
  @UseGuards(AdminGuard)
  delete() {
    return this.service.delete();
  }
}
