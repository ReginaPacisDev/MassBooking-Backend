import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../database';
import { Login } from './auth.types';
import { UsersService } from '../user/users.service';
import { USERS_REPOSITORY } from '../user/user.types';
import { CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,
    private userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { email },
      raw: true,
    });

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
    const payload = {
      email: user.email,
      id: user.id,
      isSuperAdmin: user.isSuperAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    };
  }

  async signup(data: CreateUserDto): Promise<Login> {
    const user = await this.userService.createUser({
      ...data,
      isSuperAdmin: true,
    });

    return this.login(user);
  }
}
