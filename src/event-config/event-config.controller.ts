import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { EventConfigService } from './event-config.service';
import {
  CreateEventConfigDto,
  UpdateEventConfigDto,
} from 'src/dto/create-event-config.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

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
