import { Test, TestingModule } from '@nestjs/testing';
import { ChristmasDrawService } from './christmas-draw.service';

describe('ChristmasDrawService', () => {
  let service: ChristmasDrawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChristmasDrawService],
    }).compile();

    service = module.get<ChristmasDrawService>(ChristmasDrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
