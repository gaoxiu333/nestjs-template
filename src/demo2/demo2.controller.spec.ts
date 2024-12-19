import { Test, TestingModule } from '@nestjs/testing';
import { Demo2Controller } from './demo2.controller';
import { Demo2Service } from './demo2.service';

describe('Demo2Controller', () => {
  let controller: Demo2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Demo2Controller],
      providers: [Demo2Service],
    }).compile();

    controller = module.get<Demo2Controller>(Demo2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
