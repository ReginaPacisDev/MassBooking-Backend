import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from '../auth';
import { BookingsService } from './bookings.service';
import { CreateBookingsDto } from './dto';
import {
  BookingsResponse,
  CreateBookingResponse,
  Stats,
} from './bookings.type';
import { Booking } from '../database';

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

  @Get('/stats')
  async getBookingsStats(
    @Query('startDate') startDate?: number,
    @Query('endDate') endDate?: number,
    @Query('type') type?: string,
    @Query('date') date?: number,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ): Promise<Stats> {
    return this.bookingsService.getBookingsStats({
      startDate,
      endDate,
      type,
      date,
      skip,
      take: limit,
    });
  }

  @Get('/')
  async getBookings(
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: number,
    @Query('endDate') endDate?: number,
    @Query('type') type?: string,
    @Query('date') date?: number,
    @Query('name') name?: string,
  ): Promise<BookingsResponse> {
    return await this.bookingsService.getBookings({
      skip,
      take: limit,
      startDate,
      endDate,
      type,
      date,
      name,
    });
  }

  @Get(':id')
  async getBooking(@Param('id') id: string): Promise<Booking> {
    return await this.bookingsService.getBooking(id);
  }
}
