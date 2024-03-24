import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { Booking as PrismaBooking } from '@prisma/client';
import { literal, fn, col, ProjectionAlias } from 'sequelize';

import { Booking as SequelizeBooking, PrismaService } from '../database';
import {
  BOOKINGS_REPOSITORY,
  Booking,
  BookingsResponse,
  CreateBookingResponse,
  GetBookings,
  Stats,
} from './bookings.type';
import { generateWhereClause } from './helpers';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    @Inject(BOOKINGS_REPOSITORY)
    private bookingRepository: typeof SequelizeBooking,
  ) {}

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

  async getBookingsStats(params: GetBookings): Promise<Stats> {
    const { skip, take, ...restOfParams } = params;

    const {
      bookedBy: { field: bookedBy },
      uniqueBookingId: { field: uniqueBookingId },
    } = SequelizeBooking.getAttributes();

    const amountPaid: ProjectionAlias = [
      literal(`SUM(amountPaid)`),
      'amountPaid',
    ];

    const totalMassesBooked: ProjectionAlias = [
      literal(`COUNT(*)`),
      'totalMassesBooked',
    ];

    const bookings = await this.bookingRepository.findAll({
      attributes: [bookedBy, amountPaid, totalMassesBooked],
      where: {
        ...generateWhereClause(restOfParams),
      },
      ...(skip && { offset: Number(skip) }),
      ...(take && { limit: Number(take) }),
      group: [uniqueBookingId],
    });

    const total = await this.bookingRepository.count({
      where: {
        ...generateWhereClause(restOfParams),
      },
      group: [uniqueBookingId],
    });

    const statData = await this.bookingRepository.findOne({
      attributes: [[fn('SUM', col('amountPaid')), 'totalAmountPaid']],
      raw: true,
    });

    let totalAmountPaidForPeriod = 0;
    let totalBookingsForPeriod = 0;

    bookings.forEach((booking) => {
      const normalizedBooking = booking.toJSON();

      totalAmountPaidForPeriod += Number(normalizedBooking.amountPaid);
      totalBookingsForPeriod += normalizedBooking.totalMassesBooked;
    });

    return {
      totalAmountPaid: statData.totalAmountPaid || 0,
      totalAmountPaidForPeriod,
      totalBookingsForPeriod,
      bookings,
      total: total.length,
    };
  }
}
