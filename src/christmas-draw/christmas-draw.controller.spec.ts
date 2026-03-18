import { Test, TestingModule } from '@nestjs/testing';
import { ChristmasDrawController } from './christmas-draw.controller';
import { ChristmasDrawService } from './christmas-draw.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ChristmasDrawController', () => {
  let controller: ChristmasDrawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChristmasDrawController],
      providers: [
        {
          provide: ChristmasDrawService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ChristmasDrawController>(ChristmasDrawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
