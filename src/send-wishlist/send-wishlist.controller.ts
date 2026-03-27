import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateSendWishlistDto, SubmitGiftDto } from 'src/dto/wishlist';
import { SendWishlistService } from './send-wishlist.service';
import { SendWishlist } from './send-wishlist.entity';

@Controller('send-wishlist')
@UseGuards(AuthGuard)
export class SendWishlistController {
  constructor(private readonly sendWishlistService: SendWishlistService) {}

  @Get('check')
  async checkHasSubmitted(
    @Req() req: { user: { sub: number } },
  ): Promise<{ hasSubmitted: boolean }> {
    return await this.sendWishlistService.checkHasSubmitted(req.user.sub);
  }

  @Get()
  async getAllSendWishlists(
    @Req() req: { user: { sub: number } },
  ): Promise<SendWishlist[]> {
    return await this.sendWishlistService.getAllSendWishlists(
      String(req.user.sub),
    );
  }

  @Post()
  async createSendWishlist(
    @Req() req: { user: { sub: number } },
    @Body() body: CreateSendWishlistDto,
  ): Promise<SendWishlist[]> {
    return await this.sendWishlistService.createMany(req.user.sub, body.items);
  }

  @Delete()
  async deleteAllSendWishlists(
    @Req() req: { user: { sub: number } },
  ): Promise<{ message: string }> {
    return await this.sendWishlistService.deleteAllByUser(req.user.sub);
  }

  @Post('submit-gift')
  async submitGift(
    @Req() req: { user: { sub: number; role?: string } },
    @Body() body: SubmitGiftDto,
  ): Promise<{ message: string }> {
    const userId =
      req.user.role === 'admin' && body.userId ? body.userId : req.user.sub;
    const hasSubmitGift =
      body.hasSubmitGift !== undefined ? body.hasSubmitGift : true;
    return await this.sendWishlistService.markHasSubmitGift(
      userId,
      hasSubmitGift,
    );
  }
}
