import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChristmasDraw } from './christmas-draw-entity';
import { ChristmasDrawResult } from './christmas-draw-result-entity';
import { User } from '../user/user.entity';
import { SendWishlistService } from '../send-wishlist/send-wishlist.service';
import { ChristmasDrawService } from './christmas-draw.service';

describe('ChristmasDrawService', () => {
  let service: ChristmasDrawService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ChristmasDrawService,
        {
          provide: getRepositoryToken(ChristmasDraw),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ChristmasDrawResult),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: SendWishlistService,
          useValue: {
            deleteAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChristmasDrawService>(ChristmasDrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resetUserDrawData', () => {
    it('should reset user flags and clear wishlists', async () => {
      const userRepoUpdateSpy = jest
        .spyOn(module.get(getRepositoryToken(User)), 'update')
        .mockResolvedValue({} as any);
      const wishlistServiceDeleteSpy = jest
        .spyOn(module.get(SendWishlistService), 'deleteAll')
        .mockResolvedValue();

      await service.resetUserDrawData();

      expect(userRepoUpdateSpy).toHaveBeenCalledWith(
        {},
        {
          giftCode: null,
          nickName: null,
          nicknameId: null,
          hasSpin: false,
          hasSendWishlist: false,
          hasSubmitGift: false,
        },
      );
      expect(wishlistServiceDeleteSpy).toHaveBeenCalled();
    });
  });
});
