import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { literal, fn, col, ProjectionAlias } from 'sequelize';

import { Booking as SequelizeBooking } from '../database';
import {
  BOOKINGS_REPOSITORY,
  Booking,
  BookingsResponse,
  CreateBookingResponse,
  GetBookings,
  Stats,
} from './bookings.type';
import {
  generateBookingsWhereClause,
  generateSequelizeWhereClause,
  RangeTypes,
} from './helpers';
import { handleSendMail } from '../user/helpers';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(BOOKINGS_REPOSITORY)
    private bookingRepository: typeof SequelizeBooking,
  ) {}

  private async sendBookingCreatedMail(bookedBy, adminEmail): Promise<void> {
    const subject = 'New Mass Booking';
    const text = `A new Mass booking request has been made by ${bookedBy}. Login to the admin account to manage the booking`;

    await handleSendMail({ subject, text, email: adminEmail });
  }

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

    await this.bookingRepository.bulkCreate(normalizedBookings);

    await this.sendBookingCreatedMail(
      normalizedBookings[0].bookedBy,
      process.env.ADMIN_EMAIL,
    );

    return {
      amountPaid: totalAmountPaid,
      name: bookings[0].name,
      phoneNumber: bookings[0].phoneNumber,
      email: bookings[0].email,
    };
  }

  async getBookings(params: GetBookings): Promise<BookingsResponse> {
    const { skip, take, ...restOfParams } = params;

    const bookings = await this.bookingRepository.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        ...generateBookingsWhereClause(restOfParams),
      },
      ...(skip && { offset: Number(skip) }),
      ...(take && { limit: Number(take) }),
      raw: true,
    });

    const count = await this.getBookingsCount(restOfParams);

    return {
      bookings,
      total: count,
    };
  }

  async getBooking(id: string): Promise<SequelizeBooking> {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: Number(id),
      },
      raw: true,
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getBookingsCount(where?: RangeTypes): Promise<number> {
    const count = await this.bookingRepository.count(
      generateBookingsWhereClause(where),
    );

    return count;
  }

  async getBookingsStats(params: GetBookings): Promise<Stats> {
    const { skip, take, ...restOfParams } = params;

    const {
      bookedBy: { field: bookedBy },
      uniqueBookingID: { field: uniqueBookingID },
      createdBy: { field: createdBy },
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
      attributes: [bookedBy, amountPaid, totalMassesBooked, createdBy],
      where: {
        ...generateSequelizeWhereClause(restOfParams),
      },
      ...(skip && { offset: Number(skip) }),
      ...(take && { limit: Number(take) }),
      group: [uniqueBookingID],
      raw: true,
    });

    const total = await this.bookingRepository.count({
      where: {
        ...generateSequelizeWhereClause(restOfParams),
      },
      group: [uniqueBookingID],
    });

    const totalBookingsForPeriod = await this.bookingRepository.count({
      where: {
        ...generateSequelizeWhereClause(restOfParams),
      },
    });

    const statData = await this.bookingRepository.findOne({
      attributes: [[fn('SUM', col('amountPaid')), 'totalAmountPaid']],
      raw: true,
    });

    let totalAmountPaidForPeriod = 0;

    bookings.forEach((booking) => {
      totalAmountPaidForPeriod += Number(booking.amountPaid);
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
