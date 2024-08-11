import { Sequelize } from 'sequelize-typescript';
import { Booking, User } from './models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
      });
      sequelize.addModels([Booking, User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
