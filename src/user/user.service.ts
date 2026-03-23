import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/dto/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async findAllbyAdmin() {
    const users = await this.userRepo.find();
    return users.map((user) => {
      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        hasSpin: user.hasSpin,
        hasSendWishlist: user.hasSendWishlist,
        hasSubmitGift: user.hasSubmitGift,
      };
    });
  }

  async findAllbyUser() {
    const users = await this.userRepo.find();
    return users.map((user) => {
      return {
        nicknameId: user.nicknameId,
        nickName: user.nickName,
      };
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
