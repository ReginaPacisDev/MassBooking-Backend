import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  startDate: number;

  @IsNotEmpty()
  @IsNumber()
  endDate: number;

  @IsNotEmpty()
  @IsNumber()
  amountPaid: number;

  @IsNotEmpty()
  @IsString()
  massIntention: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  bookedBy: string;

  @IsOptional()
  @IsString()
  sundayMassTime?: string;

  @IsOptional()
  @IsString()
  weekdayMassTime?: string;
}

export class CreateBookingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @Type(() => CreateBookingDto)
  bookings: CreateBookingDto[];
}
