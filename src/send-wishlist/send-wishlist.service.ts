import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendWishlist } from './send-wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SendWishlistService {
  constructor(
    @InjectRepository(SendWishlist)
    private readonly sendWishlistRepo: Repository<SendWishlist>,
  ) {}

  async getAllSendWishlists(userId: number): Promise<SendWishlist[]> {
    return await this.sendWishlistRepo.find({ where: { userId } });
  }

  async createMany(
    userId: number,
    items: { wish: string; link?: string }[],
  ): Promise<SendWishlist[]> {
    if (items.length === 0 || items.length > 3) {
      throw new BadRequestException('You must submit 3 wishes.');
    }

    const existing = await this.sendWishlistRepo.find({ where: { userId } });
    if (existing.length > 0) {
      throw new BadRequestException(
        'You have already submitted your wishlist. You may save your other wishes for next year.',
      );
    }

    const sendWishlists = items.map((item) =>
      this.sendWishlistRepo.create({ userId, ...item }),
    );
    return await this.sendWishlistRepo.save(sendWishlists);
  }

  async deleteAllByUser(userId: number): Promise<{ message: string }> {
    const existing = await this.sendWishlistRepo.find({ where: { userId } });

    if (existing.length === 0) {
      throw new NotFoundException('No wishlist found for this user.');
    }

    await this.sendWishlistRepo.delete({ userId });
    return { message: 'Wishlist deleted successfully.' };
  }
}
