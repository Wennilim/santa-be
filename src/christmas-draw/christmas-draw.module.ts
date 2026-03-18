import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChristmasDrawService } from './christmas-draw.service';
import { ChristmasDrawController } from './christmas-draw.controller';
import { AuthModule } from '../auth/auth.module';
import { ChristmasDraw } from './christmas-draw-entity';
import { ChristmasDrawResult } from './christmas-draw-result-entity';
import { SendWishlistModule } from '../send-wishlist/send-wishlist.module';
import { User } from '../user/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ChristmasDraw, ChristmasDrawResult, User]),
    SendWishlistModule,
  ],
  providers: [ChristmasDrawService],
  controllers: [ChristmasDrawController],
})
export class ChristmasDrawModule {}
