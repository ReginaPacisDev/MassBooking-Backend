import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../database';
import { Login } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }

  async login(user: User): Promise<Login> {
    const payload = { email: user.email, id: user.id };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async signup(data: Prisma.UserCreateInput): Promise<Login> {
    const existingUser = this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    const password = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_OR_ROUNDS),
    );

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password,
      },
    });

    return this.login(user);
  }
}
