import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChristmasDrawService } from './christmas-draw.service';
import { ChristmasDrawController } from './christmas-draw.controller';
import { AuthModule } from '../auth/auth.module';
import { ChristmasDraw } from './christmas-draw-entity';
import { ChristmasDrawResult } from './christmas-draw-result-entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ChristmasDraw, ChristmasDrawResult, User]),
  ],
  providers: [ChristmasDrawService],
  controllers: [ChristmasDrawController],
})
export class ChristmasDrawModule {}
