import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database';
import { handleSendMail } from './helpers';
import { AdminCreateUser, GetUser, UpdateUser, User } from './user.types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    const password = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_OR_ROUNDS),
    );

    return await this.prisma.user.create({
      data: {
        ...data,
        password,
      },
    });
  }

  async resetPassword(email: string, password): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_OR_ROUNDS),
    );

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async sendPasswordResetLink(email): Promise<void> {
    const passwordResetLink = `${process.env.REACT_APP_URL}/resetPassword?email=${email}`;

    const subject = 'Password Reset';
    const text = `Please use this link to reset your password ${passwordResetLink}`;

    await handleSendMail({ subject, text, email });
  }

  async adminCreateUser(data: AdminCreateUser): Promise<void> {
    const password = uuidv4();

    await this.createUser({
      ...data,
      password,
    });

    const loginLink = `${process.env.REACT_APP_URL}/signin`;

    const subject = 'Your Login Details';

    const text = `
      Please use these details to sign in on ${loginLink}
      Email: ${data.email}
      Password: ${password}
    `;

    await handleSendMail({ subject, text, email: data.email });
  }

  async getUser(data: GetUser): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...data,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
    };
  }

  async updateUser(userId: number, data: UpdateUser): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('User already exists');
      }
    }

    const updateObject = {
      ...data,
    };

    if (data.password) {
      updateObject.password = await bcrypt.hash(
        data.password,
        Number(process.env.BCRYPT_SALT_OR_ROUNDS),
      );
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateObject,
      },
    });
  }
}
