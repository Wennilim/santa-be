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

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (existing.length > 0) {
      user.hasSendWishlist = true;
      await this.userRepo.save(user);
      throw new BadRequestException(
        'You have already submitted your wishlist. You may save your other wishes for next year.',
      );
    }

    const sendWishlists = items.map((item) =>
      this.sendWishlistRepo.create({ nicknameId, ...item }),
    );

    const result = await this.sendWishlistRepo.save(sendWishlists);

    user.hasSendWishlist = true;
    await this.userRepo.save(user);

    return result;
  }

  async deleteAllByUser(userId: number): Promise<{ message: string }> {
    const nicknameId = String(userId);
    const existing = await this.sendWishlistRepo.find({
      where: { nicknameId },
    });

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user && user.hasSendWishlist) {
      user.hasSendWishlist = false;
      await this.userRepo.save(user);
    }

    if (existing.length === 0) {
      throw new NotFoundException('No wishlist found for this user.');
    }

    await this.sendWishlistRepo.delete({ nicknameId });
    return { message: 'Wishlist deleted successfully.' };
  }

  async markHasSubmitGift(
    userId: number,
    hasSubmitGift = true,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.hasSubmitGift = hasSubmitGift;
    await this.userRepo.save(user);
    return { message: 'Gift submission status updated successfully.' };
  }

  async checkHasSubmitted(userId: number): Promise<{ hasSubmitted: boolean }> {
    const nicknameId = String(userId);
    const existing = await this.sendWishlistRepo.findOne({
      where: { nicknameId },
    });
    return { hasSubmitted: !!existing };
  }

  async deleteAll(): Promise<void> {
    await this.sendWishlistRepo.clear();
  }
}
