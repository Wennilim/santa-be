import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), AuthModule],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistModule {}
