import { Test, TestingModule } from '@nestjs/testing';
import { ItemsServices } from './items.service';

describe('ItemsService', () => {
  let service: ItemsServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsServices],
    }).compile();

    service = module.get<ItemsServices>(ItemsServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
