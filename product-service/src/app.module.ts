import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from './app.constants';

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
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
