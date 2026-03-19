import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConfig } from './event-config.entity';
import { EventConfigService } from './event-config.service';
import { EventConfigController } from './event-config.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventConfig]), AuthModule],
  controllers: [EventConfigController],
  providers: [EventConfigService],
  exports: [EventConfigService],
})
export class EventConfigModule {}
