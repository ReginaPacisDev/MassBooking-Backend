import * as moment from 'moment';
import { Op } from 'sequelize';

export interface RangeTypes {
  startDate?: number;
  endDate?: number;
  date?: number;
  type?: any;
  name?: string;
}

export const generateSequelizeWhereClause = ({ type, date }: RangeTypes) => {
  const format = 'DD-MM-YYYY';

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
}: RangeTypes) => {
  const format = 'DD-MM-YYYY';

  return {
    ...(startDate && {
      ...generateDateRangeWhereObject(startDate, endDate, format),
    }),
    ...(type && {
      ...generateDateRangeWhereObject(
        moment().startOf(type),
        moment().endOf(type),
        format,
      ),
    }),
    ...(date && {
      ...generateDateRangeWhereObject(date, date, format),
    }),
    ...(name && {
      [Op.or as symbol]: [
        {
          name: {
            [Op.contains as symbol]: name,
          },
        },
        {
          bookedBy: {
            [Op.contains as symbol]: name,
          },
        },
      ],
    }),
  };
};
