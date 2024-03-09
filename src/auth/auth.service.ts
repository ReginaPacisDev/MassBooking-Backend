import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../database';
import { Login } from './auth.types';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

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

    return {
      accessToken: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    };
  }

  async signup(data: Prisma.UserCreateInput): Promise<Login> {
    const user = await this.userService.createUser({
      ...data,
      isSuperAdmin: true,
    });

    return this.login(user);
  }
}
