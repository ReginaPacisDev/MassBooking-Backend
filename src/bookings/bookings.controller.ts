import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Booking } from '@prisma/client';

import { Public } from '../auth';
import { BookingsService } from './bookings.service';
import { CreateBookingsDto } from './dto';
import { CreateBookingResponse, Stats } from './bookings.type';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('/')
  @Public()
  async createBooking(
    @Body() { bookings }: CreateBookingsDto,
  ): Promise<CreateBookingResponse> {
    return await this.bookingsService.createBooking(bookings);
  }

  @Get('/')
  async getBookings(@Query('skip') skip: string): Promise<Booking[]> {
    return await this.bookingsService.getBookings(Number(skip));
  }

  @Get('/latest-bookings')
  async getLatestBookings(): Promise<Booking[]> {
    return this.bookingsService.getFiveLatestBookings();
  }

  @Get('/stats')
  async getBookingsStats(
    @Query('startDate') startDate?: number,
    @Query('endDate') endDate?: number,
    @Query('type') type?: string,
    @Query('date') date?: number,
  ): Promise<Stats> {
    return this.bookingsService.getBookingsStats({
      startDate,
      endDate,
      type,
      date,
    });
  }
}
