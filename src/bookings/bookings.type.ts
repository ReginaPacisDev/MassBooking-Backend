import { Bookings as PrismaBooking } from '@prisma/client';
import { Booking as SequelizeBooking } from '../database';
import { RangeTypes } from './helpers';

export interface Booking {
  name: string;
  email: string;
  startDate: number;
  endDate: number;
  amountPaid: number;
  massIntention: string;
  phoneNumber: string;
  bookedBy: string;
}

export interface CreateBookingResponse {
  amountPaid: number;
  name: string;
  phoneNumber: string;
  email: string;
}

export interface Stats {
  totalAmountPaid: number;
  totalAmountPaidForPeriod: number;
  totalBookingsForPeriod: number;
  bookings: SequelizeBooking[];
  total: number;
}

export interface BookingsResponse {
  bookings: PrismaBooking[];
  total: number;
}

export interface GetBookings extends RangeTypes {
  skip?: string;
  take?: string;
}

export const BOOKINGS_REPOSITORY = 'BOOKINGS_REPOSITORY';
