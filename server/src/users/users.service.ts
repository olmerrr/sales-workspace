import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAllUsers() {
    return this.usersRepository.find();
  }

  async getUsersById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  createUser(body: CreateUserDto) {
    const name = body.name;
    const bio = body.bio;
    const user = this.usersRepository.create({ name, bio });

    return this.usersRepository.save(user);
  }
}
