import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking as SequelizeBooking } from '../database';
import { BOOKINGS_REPOSITORY } from './bookings.type';
import { TempBookings } from './temp.service';

@Module({
  providers: [
    BookingsService,
    TempBookings,
    {
      provide: BOOKINGS_REPOSITORY,
      useValue: SequelizeBooking,
    },
  ],
  controllers: [BookingsController],
})
export class BookingsModule {}
