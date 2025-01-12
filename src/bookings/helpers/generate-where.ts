import * as moment from 'moment';
import { Op } from 'sequelize';
import { CreatedBy } from './enums';

export interface RangeTypes {
  startDate?: number;
  endDate?: number;
  date?: number;
  type?: any;
  name?: string;
  massTime?: string;
  massIntention?: string;
  createdBy?: CreatedBy;
}

export const massIntentions = [
  'Birthday Thanksgiving',
  'Child Thanksgiving',
  'Wedding Anniversary Thanksgiving',
  'Special Intentions',
  "God's Blessings, Guidance and Protection",
  "God's Mercy and Healing",
  "Journey Mercies And God's Protection",
  'Repose Of the Souls Departed',
  'Repose Of The Souls In Purgatory',
  "God's Mercy, Intervention and Favour",
];

export const generateSequelizeWhereClause = ({
  type,
  date,
  createdBy,
}: RangeTypes) => {
  const format = 'DD-MM-YYYY';

  const isValidCreatedByValue = createdBy && createdBy.toString() !== 'All';

  return {
    ...(type && {
      [Op.and as symbol]: [
        {
          createdAt: {
            [Op.gte as symbol]: moment().startOf(type).startOf('day').utc(true),
          },
        },
        {
          createdAt: {
            [Op.lte as symbol]: moment().endOf(type).endOf('day').utc(true),
          },
        },
      ],
    }),
    ...(date && {
      [Op.and as symbol]: [
        {
          createdAt: {
            [Op.gte as symbol]: moment(date, format).startOf('day').utc(true),
          },
        },
        {
          createdAt: {
            [Op.lte as symbol]: moment(date, format).endOf('day').utc(true),
          },
        },
      ],
    }),
    ...(isValidCreatedByValue && {
      createdBy,
    }),
  };
};

export const generateDateRangeWhereObject = (startDate, endDate, format) => {
  return {
    [Op.or as symbol]: [
      {
        startDate: {
          [Op.between as symbol]: [
            moment(startDate, format).startOf('day').utc(true).unix(),
            moment(endDate, format).startOf('day').utc(true).unix(),
          ],
        },
      },
      {
        endDate: {
          [Op.between as symbol]: [
            moment(startDate, format).startOf('day').utc(true).unix(),
            moment(endDate, format).startOf('day').utc(true).unix(),
          ],
        },
      },
      {
        startDate: {
          [Op.lte as symbol]: moment(startDate, format)
            .startOf('day')
            .utc(true)
            .unix(),
        },
        endDate: {
          [Op.gte as symbol]: moment(endDate, format)
            .startOf('day')
            .utc(true)
            .unix(),
        },
      },
    ],
  };
};

export const generateBookingsWhereClause = ({
  startDate,
  endDate,
  type,
  date,
  name,
  massTime,
  massIntention,
}: RangeTypes) => {
  const format = 'DD-MM-YYYY';

  const whereConditions = [];

  if (startDate) {
    whereConditions.push(
      generateDateRangeWhereObject(startDate, endDate, format),
    );
  }

  if (type) {
    whereConditions.push(
      generateDateRangeWhereObject(
        moment().startOf(type),
        moment().endOf(type),
        format,
      ),
    );
  }

  if (date) {
    whereConditions.push(generateDateRangeWhereObject(date, date, format));
  }

  if (name) {
    whereConditions.push({
      [Op.or as symbol]: [
        {
          name: {
            [Op.like as symbol]: `%${name}%`,
          },
        },
        {
          bookedBy: {
            [Op.like as symbol]: `%${name}%`,
          },
        },
      ],
    });
  }

  if (massTime) {
    whereConditions.push({
      [Op.or as symbol]: [
        {
          sundayMassTime: massTime,
        },
        {
          saturdayMassTime: massTime,
        },
        {
          tuesdayMassTime: massTime,
        },
        {
          weekdayMassTime: massTime,
        },
      ],
    });
  }

  if (massIntention) {
    whereConditions.push({
      massIntention: massIntentions.includes(massIntention)
        ? massIntention
        : {
            [Op.notIn]: massIntentions,
          },
    });
  }

  return {
    [Op.and as symbol]: whereConditions,
  };
};
