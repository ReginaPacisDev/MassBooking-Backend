import { IsNotEmpty, IsString } from 'class-validator';

export class AdminCreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
