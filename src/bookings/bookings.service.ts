import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { Booking as PrismaBooking } from '@prisma/client';

import { PrismaService } from '../database';
import {
  Booking,
  BookingsResponse,
  CreateBookingResponse,
  GetBookings,
  Stats,
  TotalMassesBooked,
} from './bookings.type';
import { RangeTypes, generateWhereClause } from './helpers';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(bookings: Booking[]): Promise<CreateBookingResponse> {
    const totalAmountPaid = bookings.reduce(
      (total, currBooking) => total + currBooking.amountPaid,
      0,
    );

    const uniqueBookingID = `${uuidv4()}-${totalAmountPaid}`;

    const normalizedBookings = bookings.map((booking) => ({
      ...booking,
      uniqueBookingID,
    }));

    await this.prisma.booking.createMany({ data: normalizedBookings });

    return {
      amountPaid: totalAmountPaid,
      name: bookings[0].name,
      phoneNumber: bookings[0].phoneNumber,
      email: bookings[0].email,
    };
  }

  async getBookings(params: GetBookings): Promise<BookingsResponse> {
    const { skip, take, ...restOfParams } = params;

    const bookings = await this.prisma.booking.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        ...generateWhereClause(restOfParams),
      },
      ...(skip && { skip: Number(skip) }),
      ...(take && { take: Number(take) }),
    });

    const count = await this.getBookingsCount(
      generateWhereClause(restOfParams),
    );

    return {
      bookings,
      total: count,
    };
  }

  async getBooking(id: string): Promise<PrismaBooking> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getBookingsCount(where?: Prisma.BookingWhereInput): Promise<number> {
    const count = await this.prisma.booking.count({ where });

    return count;
  }

  async getBookingsStats(range: RangeTypes): Promise<Stats> {
    const totalAmountPaid = await this.prisma.booking.aggregate({
      _sum: {
        amountPaid: true,
      },
    });

    const bookings = await this.prisma.booking.findMany({
      select: {
        amountPaid: true,
        uniqueBookingID: true,
        bookedBy: true,
      },
      where: {
        ...generateWhereClause(range),
      },
    });

    const total = await this.prisma.booking.count({
      where: {
        ...generateWhereClause(range),
      },
    });

    let totalAmountPaidThisPeriod = 0;
    let totalMassesBookedThisPeriod = 0;
    let bookingsPerUniqueId: Record<string, TotalMassesBooked>;

    for (const booking of bookings) {
      const amountPaid = Number(booking.amountPaid);

      totalAmountPaidThisPeriod += amountPaid;
      totalMassesBookedThisPeriod += 1;

      if (!bookingsPerUniqueId[booking.uniqueBookingID]) {
        bookingsPerUniqueId[booking.uniqueBookingID] = {
          ...booking,
          amountPaid,
          totalMassesBooked: 1,
        };
      } else {
        bookingsPerUniqueId[booking.uniqueBookingID].totalMassesBooked += 1;
        bookingsPerUniqueId[booking.uniqueBookingID].amountPaid += amountPaid;
      }
    }

    return {
      totalAmountPaid: Number(totalAmountPaid._sum.amountPaid),
      totalAmountPaidThisPeriod,
      totalMassesBookedThisPeriod,
      bookings: Object.values(bookingsPerUniqueId || {}),
      total,
    };
  }
}
