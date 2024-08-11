import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User as SequelizeUser } from '../database';
import { handleSendMail } from './helpers';
import { AdminCreateUser, GetUser, UpdateUser, User } from './user.types';
import { USERS_REPOSITORY } from './user.types';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof SequelizeUser,
  ) {}

  async createUser(data: CreateUserDto): Promise<SequelizeUser> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
      raw: true,
    });

    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    const password = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_OR_ROUNDS),
    );

    return await this.usersRepository.create({
      ...data,
      password,
    });
  }

  async resetPassword(email: string, password: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
      raw: true,
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_OR_ROUNDS),
    );

    await this.usersRepository.update(
      { password: hashedPassword },
      {
        where: {
          email,
        },
      },
    );
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
    const user = await this.usersRepository.findOne({
      where: {
        ...data,
      },
      raw: true,
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
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      raw: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: data.email },
        raw: true,
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

    await this.usersRepository.update(
      { ...updateObject },
      {
        where: {
          id: userId,
        },
      },
    );
  }
}
