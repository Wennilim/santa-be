import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
  ) {}

  async getAllWishlists(userId: number) {
    return await this.wishlistRepo.find({ where: { userId } });
  }

  async createWishlist(userId: number, name: string) {
    const wishlist = this.wishlistRepo.create({ userId, name });
    return await this.wishlistRepo.save(wishlist);
  }

  async updateWishlist(id: number, name: string) {
    const result = await this.wishlistRepo.update(id, { name });

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist not found');
    }

    return this.wishlistRepo.findOne({ where: { id } });
  }

  async deleteWishlist(id: number) {
    console.log(`[DEBUG] Calling WishlistService.deleteWishlist for id ${id}`);
    const result = await this.wishlistRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist not found');
    }

    return { message: 'Deleted successfully' };
  }
}
