import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers() {
    return this.UsersService.getAllUsers();
  }

  @Get('about')
  getAboutUsers(): string {
    return 'About Users';
  }

  @Get('search')
  getUserSearch(@Query('name') name: string): string {
    return `User ${name}`;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.UsersService.getUsersById(Number(id));
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.UsersService.createUser(body);
  }

  @Put(':id')
  update() {
    return 'Update user';
  }

  @Delete(':id')
  remove() {
    return 'Remove user';
  }
}
