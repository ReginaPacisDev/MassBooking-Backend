import moment from 'moment';

export interface RangeTypes {
  startDate?: number;
  endDate?: number;
  date?: number;
  type?: any;
}

export const generateWhereClause = ({
  startDate,
  endDate,
  type,
  date,
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
        gtw: moment().startOf(type).startOf('day').utc(true).unix(),
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
  };
};
