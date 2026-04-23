import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './create-user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAllUsers() {
    return this.usersRepository.find({
      relations: {
        leads: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getUsersById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  createUser(body: CreateUserDto) {
    const name = body.name;
    const bio = body.bio;
    const role = body.role ?? UserRole.USER;
    const user = this.usersRepository.create({ name, bio, role });

    return this.usersRepository.save(user);
  }
}
