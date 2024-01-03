import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoginController, LogoutController } from './login/login.controller';
import { CouchDbService } from 'lib/services/Connection';
import { UserController } from './user/user.controller';
import { HashService } from 'lib/services/HashService';
import { JWTService } from 'lib/services/JWTService';


@Module({
  imports: [],
  controllers: [
    AppController,
    LoginController,
    LogoutController,
    UserController
  ],
  providers: [
    CouchDbService,
    HashService,
    JWTService
  ],
})
export class AppModule {}
