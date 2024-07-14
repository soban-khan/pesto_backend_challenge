import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from './constants/app.constants';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: ENV.PSQL.HOST,
      port: ENV.PSQL.PORT,
      username: ENV.PSQL.USERNAME,
      password: ENV.PSQL.PASSWORD,
      database: ENV.PSQL.DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
    ProductModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class ProductModule {}
