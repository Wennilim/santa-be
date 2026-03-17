import { Test, TestingModule } from '@nestjs/testing';
import { ChristmasDrawController } from './christmas-draw.controller';

describe('ChristmasDrawController', () => {
  let controller: ChristmasDrawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChristmasDrawController],
    }).compile();

    controller = module.get<ChristmasDrawController>(ChristmasDrawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
