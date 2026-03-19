import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { ChristmasDraw } from './christmas-draw-entity';
import { ChristmasDrawResult } from './christmas-draw-result-entity';
import { SendWishlistService } from '../send-wishlist/send-wishlist.service';

@Injectable()
export class ChristmasDrawService {
  constructor(
    @InjectRepository(ChristmasDraw)
    private drawRepo: Repository<ChristmasDraw>,

    @InjectRepository(ChristmasDrawResult)
    private resultRepo: Repository<ChristmasDrawResult>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly sendWishlistService: SendWishlistService,
  ) {}

  // Fisher–Yates shuffle
  private shuffle(array: User[]): User[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  @Cron('0 0 1 11 *', {
    name: 'generate_christmas_draw',
    timeZone: 'Asia/Singapore',
  })
  async generateDraw() {
    const year = new Date().getFullYear();

    // 防止重复生成
    const existingDraw = await this.drawRepo.findOne({ where: { year } });
    if (existingDraw) {
      console.log(`Draw for year ${year} already exists.`);
      return;
    }

    // 获取用户
    const users = await this.userRepo.find({
      where: { isVerified: true },
    });

    if (users.length < 2) {
      console.log('Not enough users for draw.');
      return;
    }

    console.log(`Starting Secret Santa draw ${year}`);

    /*
      获取去年结果
    */

    const lastYear = year - 1;

    const lastDraw = await this.drawRepo.findOne({
      where: { year: lastYear },
    });

    let lastMap = new Map<number, number>();

    if (lastDraw) {
      const lastResults = await this.resultRepo.find({
        where: { draw: { id: lastDraw.id } },
        relations: ['giver', 'receiver'],
      });

      lastMap = new Map(lastResults.map((r) => [r.giver.id, r.receiver.id]));
    }

    /*
      生成合法 shuffle
    */

    let shuffled: User[];
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 1000) {
      shuffled = this.shuffle([...users]);
      valid = true;
      attempts++;

      for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];

        // 防止连续两年抽到同一个人
        if (lastMap.get(giver.id) === receiver.id) {
          valid = false;
          break;
        }
      }
    }

    if (!valid) {
      console.warn(
        `[Secret Santa Warning] Could not find a valid matching avoiding last year's recipients after 1000 attempts for year ${year}. Falling back to completely random draw.`,
      );
      // Fallback: Use the last shuffled array, ignoring the constraint
    }

    /*
      保存数据
    */

    await this.drawRepo.manager.transaction(async (manager) => {
      const draw = manager.create(ChristmasDraw, {
        year,
        status: 'generated',
        drawDate: new Date(),
      });

      const savedDraw = await manager.save(draw);

      const results = shuffled.map((giver, i) => ({
        draw: savedDraw,
        giver,
        receiver: shuffled[(i + 1) % shuffled.length],
      }));

      await manager.save(ChristmasDrawResult, results);
    });

    console.log(`Christmas draw ${year} generated successfully`);
  }

  /*
    查询自己的抽奖对象
  */

  async getMyRecipient(userId: number) {
    const year = new Date().getFullYear();

    const draw = await this.drawRepo.findOne({
      where: { year },
    });

    if (!draw) {
      throw new NotFoundException('Event not started.');
    }

    if (draw.status !== 'revealed') {
      throw new ForbiddenException('Draw not revealed yet');
    }

    const result = await this.resultRepo.findOne({
      where: {
        draw: { id: draw.id },
        giver: { id: userId },
      },
      relations: ['receiver'],
    });

    if (!result) {
      throw new NotFoundException('Recipient not found');
    }

    const wishlist = await this.sendWishlistService.getAllSendWishlists(
      result.receiver.id,
    );

    return {
      id: result.id,
      recipient_name: result.receiver.fullname,
      gender: result.receiver.gender,
      department: result.receiver.department,
      wishlist: wishlist || [],
    };
  }

  /*
    导出某一年完整名单
  */

  async exportDraw(year: number) {
    const draw = await this.drawRepo.findOne({
      where: { year },
    });

    if (!draw || draw.status !== 'revealed') {
      throw new ForbiddenException('Draw not revealed yet');
    }

    return this.resultRepo.find({
      where: { draw: { id: draw.id } },
      relations: ['giver', 'receiver'],
    });
  }

  /*
    管理员公布结果
  */

  async revealDraw(year: number) {
    const draw = await this.drawRepo.findOne({
      where: { year },
    });

    if (!draw) {
      throw new NotFoundException('Draw not found');
    }

    draw.status = 'revealed';

    return this.drawRepo.save(draw);
  }

  /*
    重置某一年抽奖数据 (仅用于测试)
  */
  async resetDraw(year: number) {
    const draw = await this.drawRepo.findOne({
      where: { year },
    });

    if (!draw) {
      throw new NotFoundException('Draw records for this year not found');
    }

    // 先删除关联的抽奖结果 (ChristmasDrawResult)
    await this.resultRepo.delete({ draw: { id: draw.id } });

    // 再删除主表记录 (ChristmasDraw)
    await this.drawRepo.delete(draw.id);

    return { message: `Draw for year ${year} has been reset successfully.` };
  }

  async getRevealStatus() {
    const year = new Date().getFullYear();

    const draw = await this.drawRepo.findOne({
      where: { year },
    });

    if (!draw) {
      return {
        status: 'pending',
      };
    }

    return {
      status: draw.status,
    };
  }
}
