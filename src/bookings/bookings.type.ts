import { Booking as PrismaBooking } from '@prisma/client';
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

export interface TotalMassesBooked {
  amountPaid: number;
  uniqueBookingID: string;
  bookedBy: string;
  totalMassesBooked: number;
}

export interface Stats {
  totalAmountPaid: number;
  totalAmountPaidThisPeriod: number;
  totalMassesBookedThisPeriod: number;
  bookings: TotalMassesBooked[];
}

export interface BookingsResponse {
  bookings: PrismaBooking[];
  total: number;
}

export interface GetBookings extends RangeTypes {
  skip?: string;
  take?: string;
}
