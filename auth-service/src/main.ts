import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './app.constants';
import { ResponseInterceptor } from './response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(ENV.PORT);
}
bootstrap();
