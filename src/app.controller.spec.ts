import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MockUserService } from './user/user.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    appController = new AppController(
      MockUserService.get()
    )
  });

  describe('root', () => {
    it('should be defined"', () => {
      expect(appController).toBeDefined()
    });
  });
});
