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

export const generateWhereClause = ({
  startDate,
  endDate,
  type,
  date,
  name,
}: RangeTypes) => {
  const format = 'DD-MM-YYYY';

  return {
    ...(startDate && {
      startDate: {
        lte: moment(endDate, format).startOf('day').utc(true).unix(),
      },
      endDate: {
        gte: moment(startDate, format).startOf('day').utc(true).unix(),
      },
    }),
    ...(type && {
      startDate: {
        lte: moment().endOf(type).startOf('day').utc(true).unix(),
      },
      endDate: {
        gte: moment().startOf(type).startOf('day').utc(true).unix(),
      },
    }),
    ...(date && {
      startDate: {
        lte: moment(date, format).endOf('day').utc(true).unix(),
      },
      endDate: {
        gte: moment(date, format).startOf('day').utc(true).unix(),
      },
    }),
    ...(name && {
      OR: [
        {
          name: {
            contains: name,
          },
        },
        {
          bookedBy: {
            contains: name,
          },
        },
      ],
    }),
  };
};
