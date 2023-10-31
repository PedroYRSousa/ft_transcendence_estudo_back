import { Test, TestingModule } from '@nestjs/testing';
import { App2Gateway } from './app2.gateway';

describe('App2Gateway', () => {
  let gateway: App2Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [App2Gateway],
    }).compile();

    gateway = module.get<App2Gateway>(App2Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
