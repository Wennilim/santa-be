import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SendWishlist } from './send-wishlist.entity';
import { SendWishlistService } from './send-wishlist.service';

describe('SendWishlistService', () => {
  let service: SendWishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendWishlistService,
        {
          provide: getRepositoryToken(SendWishlist),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SendWishlistService>(SendWishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
