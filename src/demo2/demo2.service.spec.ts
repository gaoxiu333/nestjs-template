import { Test, TestingModule } from '@nestjs/testing';
import { Demo2Service } from './demo2.service';

describe('Demo2Service', () => {
  let service: Demo2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Demo2Service],
    }).compile();

    service = module.get<Demo2Service>(Demo2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
