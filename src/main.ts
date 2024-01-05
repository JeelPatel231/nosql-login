import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtUserPayload } from './common/middleware/User.middleware';
import { static as expressStatic } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: JwtUserPayload
    }
  }
}

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({transform : true}))
  app.use(cookieParser())

  app.use('/static', expressStatic(join(__dirname, '..', 'public')))

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  await app.listen(3000);
}
bootstrap();
