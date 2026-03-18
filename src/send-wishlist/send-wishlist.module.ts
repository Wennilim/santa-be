import { forwardRef, Module } from '@nestjs/common';
import { SendWishlistController } from './send-wishlist.controller';
import { SendWishlistService } from './send-wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendWishlist } from 'src/send-wishlist/send-wishlist.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SendWishlist]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SendWishlistController],
  providers: [SendWishlistService],
  exports: [SendWishlistService],
})
export class SendWishlistModule {}
