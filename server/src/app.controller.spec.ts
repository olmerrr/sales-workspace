import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return api info object', () => {
      const result = appController.getApiInfo();
      expect(result).toMatchObject({
        name: 'Sales Workspace API',
        status: 'ok',
        version: 'v1',
      });
      expect(typeof result.timestamp).toBe('string');
    });

    it('should return health object', () => {
      const health = appController.getHealth();
      expect(health).toMatchObject({
        status: 'ok',
      });
      expect(typeof health.timestamp).toBe('string');
      expect(typeof health.uptimeSeconds).toBe('number');
    });
  });
});
