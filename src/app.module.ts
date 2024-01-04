import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [CommonModule, AuthModule],
  controllers: [
    AppController,
    UserController
  ],
})
export class AppModule {}
