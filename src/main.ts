import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { JwtUserPayload } from './common/middleware/User.middleware';

declare global {
  namespace Express {
    interface Request {
      user: JwtUserPayload
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform : true}))
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
