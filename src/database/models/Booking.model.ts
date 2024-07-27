import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Booking extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
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
  startDate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
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
    allowNull: false,
  })
  mass: string;

  totalAmountPaid?: number;

  totalMassesBooked?: number;
}
