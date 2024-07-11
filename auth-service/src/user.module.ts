import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from './constants/app.constants';
import { User } from './user.entity';
import { AuthenticationGuard } from './guards/authentication.guard';

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
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class UserModule {}
