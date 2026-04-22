import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Session } from '../auth/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
