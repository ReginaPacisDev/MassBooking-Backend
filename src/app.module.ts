import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, JwtGuard } from './auth';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './user/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { SequelizeDatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BookingsModule,
    SequelizeDatabaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
