import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendWishlist } from './send-wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class SendWishlistService {
  constructor(
    @InjectRepository(SendWishlist)
    private readonly sendWishlistRepo: Repository<SendWishlist>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getAllSendWishlists(nicknameId: string): Promise<SendWishlist[]> {
    return await this.sendWishlistRepo.find({ where: { nicknameId } });
  }

  async createMany(
    userId: number,
    items: { wish: string; link?: string }[],
  ): Promise<SendWishlist[]> {
    if (items.length === 0 || items.length > 3) {
      throw new BadRequestException('You must submit 3 wishes.');
    }

    const nicknameId = String(userId);
    const existing = await this.sendWishlistRepo.find({
      where: { nicknameId },
    });
    if (existing.length > 0) {
      await this.userRepo.update(userId, { hasSendWishlist: true });
      throw new BadRequestException(
        'You have already submitted your wishlist. You may save your other wishes for next year.',
      );
    }

    const sendWishlists = items.map((item) =>
      this.sendWishlistRepo.create({ nicknameId, ...item }),
    );
    await this.userRepo.update(userId, { hasSendWishlist: true });
    return await this.sendWishlistRepo.save(sendWishlists);
  }

  async deleteAllByUser(userId: number): Promise<{ message: string }> {
    const nicknameId = String(userId);
    const existing = await this.sendWishlistRepo.find({
      where: { nicknameId },
    });

    if (existing.length === 0) {
      throw new NotFoundException('No wishlist found for this user.');
    }

    await this.sendWishlistRepo.delete({ nicknameId });
    return { message: 'Wishlist deleted successfully.' };
  }

  async markHasSubmitGift(userId: number): Promise<{ message: string }> {
    await this.userRepo.update(userId, { hasSubmitGift: true });
    return { message: 'Gift has been submitted to admin successfully.' };
  }
}
