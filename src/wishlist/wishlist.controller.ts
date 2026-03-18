import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMyWishlistDto, UpdateMyWishlistDto } from 'src/dto/wishlist';
import type { UserRequest } from 'src/auth/interfaces/user-request.interface';

@Controller('my-wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getAllWishlists(@Req() req: UserRequest) {
    return await this.wishlistService.getAllWishlists(req.user.sub);
  }

  @Post()
  async createWishlist(
    @Req() req: UserRequest,
    @Body() body: CreateMyWishlistDto,
  ) {
    return await this.wishlistService.createWishlist(req.user.sub, body.name);
  }

  @Put(':id')
  async updateWishlist(
    @Param('id') id: string,
    @Body() body: UpdateMyWishlistDto,
  ) {
    return await this.wishlistService.updateWishlist(Number(id), body.name);
  }

  @Delete(':id')
  async deleteWishlist(@Param('id') id: string) {
    return await this.wishlistService.deleteWishlist(Number(id));
  }
}
