import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChristmasDraw } from './christmas-draw-entity';
import { ChristmasDrawResult } from './christmas-draw-result-entity';
import { User } from '../user/user.entity';
import { SendWishlistService } from '../send-wishlist/send-wishlist.service';
import { ChristmasDrawService } from './christmas-draw.service';

describe('ChristmasDrawService', () => {
  let service: ChristmasDrawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChristmasDrawService,
        {
          provide: getRepositoryToken(ChristmasDraw),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ChristmasDrawResult),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: SendWishlistService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChristmasDrawService>(ChristmasDrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
