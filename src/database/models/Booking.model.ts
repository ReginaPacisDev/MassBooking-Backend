import {
  Table,
  Column,
  Model,
  DataType,
  createIndexDecorator,
} from 'sequelize-typescript';

const StartDateIndex = createIndexDecorator();

const EndDateIndex = createIndexDecorator();

const IdIndex = createIndexDecorator();

@Table
export class Booking extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  @IdIndex
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @StartDateIndex
  startDate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @EndDateIndex
  endDate: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  amountPaid: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  massIntention: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bookedBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uniqueBookingID: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sundayMassTime?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  weekdayMassTime?: string;

  @Column({
    type: DataType.ENUM('User', 'Admin'),
    allowNull: false,
  })
  createdBy?: string;

  totalAmountPaid?: number;

  totalMassesBooked?: number;
}
