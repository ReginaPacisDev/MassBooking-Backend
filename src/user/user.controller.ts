import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { AdminCreateUserDto, ResetPasswordDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { User } from './user.types';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/createUser')
  async adminCreateUser(@Body() body: AdminCreateUserDto): Promise<void> {
    return await this.userService.adminCreateUser(body);
  }

  @Get('send-password-reset-link/:email')
  async sendPasswordResetLink(@Param('email') email: string): Promise<void> {
    return this.userService.sendPasswordResetLink(email);
  }

  @Put('reset-password/:email')
  async resetPassword(
    @Param('email') email: string,
    @Body() body: ResetPasswordDto,
  ): Promise<void> {
    return this.userService.resetPassword(email, body.password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUser({ id: Number(id) });
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUser(Number(id), body);
  }
}
