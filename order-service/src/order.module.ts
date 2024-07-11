import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from './constants/app.constants';

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
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class OrderModule {}
