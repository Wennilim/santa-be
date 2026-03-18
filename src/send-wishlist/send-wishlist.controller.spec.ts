import { Test, TestingModule } from '@nestjs/testing';
import { SendWishlistController } from './send-wishlist.controller';
import { SendWishlistService } from './send-wishlist.service';
import { AuthGuard } from 'src/auth/auth.guard';

describe('SendWishlistController', () => {
  let controller: SendWishlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendWishlistController],
      providers: [
        {
          provide: SendWishlistService,
          useValue: {
            getAllSendWishlists: jest.fn(),
            createSendWishlist: jest.fn(),
            updateSendWishlist: jest.fn(),
            deleteSendWishlist: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SendWishlistController>(SendWishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
