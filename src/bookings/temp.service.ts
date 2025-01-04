import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.type';
import { CreatedBy } from './helpers/enums';

@Injectable()
export class TempBookings implements OnApplicationBootstrap {
  constructor(private readonly service: BookingsService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.service.deleteBookings();
  }
}
