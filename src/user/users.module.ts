import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { USERS_REPOSITORY } from './user.types';
import { User } from '../database';

@Module({
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useValue: User,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
