import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Injectable()
export class TempBookings implements OnApplicationBootstrap {
  constructor(private readonly service: BookingsService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.service.deleteBookings();
  }
}
