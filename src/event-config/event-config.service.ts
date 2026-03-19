import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventConfig } from './event-config.entity';
import {
  CreateEventConfigDto,
  UpdateEventConfigDto,
} from 'src/dto/create-event-config.dto';

@Injectable()
export class EventConfigService {
  constructor(
    @InjectRepository(EventConfig)
    private repo: Repository<EventConfig>,
  ) {}

  // CREATE（如果不存在）
  async create(dto: CreateEventConfigDto) {
    const existing = await this.repo.findOne({ where: {} });

    if (existing) {
      throw new Error('Event config already exists. Use update instead.');
    }

    const data = this.repo.create(dto);
    return this.repo.save(data);
  }

  // GET（所有用户）
  async findOne() {
    const data = await this.repo.findOne({ where: {} });

    if (!data) {
      throw new NotFoundException('Event no setup yet.');
    }

    return data;
  }

  // UPDATE（管理员）
  async update(dto: UpdateEventConfigDto) {
    const existing = await this.repo.findOne({ where: {} });

    if (!existing) {
      throw new NotFoundException('Event config not found');
    }

    Object.assign(existing, dto);
    return this.repo.save(existing);
  }

  // DEV USED
  // DELETE（管理员）
  async delete() {
    const existing = await this.repo.findOne({ where: {} });

    if (!existing) {
      throw new NotFoundException('Event config not found');
    }

    await this.repo.remove(existing);
    return { message: 'Event config deleted successfully.' };
  }
}
