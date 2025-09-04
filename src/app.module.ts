import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, JwtGuard } from './auth';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './user/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { SequelizeDatabaseModule } from './database';
import { BlockBadRequestsMiddleware } from './middlewares/block-bad-requests.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BookingsModule,
    SequelizeDatabaseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 120,
          limit: 5,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlockBadRequestsMiddleware).forRoutes('*');
  }
}
