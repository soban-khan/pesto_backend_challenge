import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ENV } from './constants/app.constants';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(ENV.PORT);
}
bootstrap();
