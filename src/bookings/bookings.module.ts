import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService, Booking as SequelizeBooking } from '../database';
import { BOOKINGS_REPOSITORY } from './bookings.type';

@Module({
  providers: [
    BookingsService,
    PrismaService,
    {
      provide: BOOKINGS_REPOSITORY,
      useValue: SequelizeBooking,
    },
  ],
  controllers: [BookingsController],
})
export class BookingsModule {}
