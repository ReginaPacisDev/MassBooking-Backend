import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { faker } from '@faker-js/faker';
import { Booking } from './bookings.type';
import { CreatedBy } from './helpers/enums';

export const sundayMasses = [
  {
    label: '06:30am',
    value: '06:30am',
  },
  {
    label: '08:20am',
    value: '08:20am',
  },
  {
    label: '10:40am',
    value: '10:40am',
  },
  {
    label: '06:00pm',
    value: '06:00pm',
  },
];

export const weekdayMasses = [
  {
    label: '06:30am',
    value: '06:30am',
  },
  {
    label: '12:30pm',
    value: '12:30pm',
  },
  {
    label: '06:30pm',
    value: '06:30pm',
  },
];

export const tuesdayMasses = [
  {
    label: '06:30am',
    value: '06:30am',
  },
  {
    label: '12:30pm',
    value: '12:30pm',
  },
];

export const saturdayMasses = [
  {
    label: '07:00am',
    value: '07:00am',
  },
];

@Injectable()
export class TempBookings implements OnApplicationBootstrap {
  constructor(private readonly service: BookingsService) {}

  async onApplicationBootstrap(): Promise<void> {
    const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

    const bookings: Booking[] = numbers.map(() => {
      const startDate: number = faker.date
        .between({
          from: '2025-01-01T00:00:00.000Z',
          to: '2025-03-31T00:00:00.000Z',
        })
        .getDate();

      const endDate: number = faker.date
        .between({
          from: '2025-03-31T00:00:00.000Z',
          to: '2025-07-31T00:00:00.000Z',
        })
        .getDate();

      const booking: Booking = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        startDate,
        endDate,
        amountPaid: faker.number.float({ min: 400, max: 5000 }),
        massIntention: faker.lorem.sentence(),
        phoneNumber: faker.phone.number(),
        bookedBy: faker.person.fullName(),
        createdBy: faker.helpers.arrayElement(Object.values(CreatedBy)),
        weekdayMassTime: faker.helpers.arrayElement(weekdayMasses).value,
        sundayMassTime: faker.helpers.arrayElement(sundayMasses).value,
        tuesdayMassTime: faker.helpers.arrayElement(sundayMasses).value,
        saturdayMassTime: faker.helpers.arrayElement(saturdayMasses).value,
      };

      return booking;
    });

    await this.service.createBooking(bookings);
  }
}
