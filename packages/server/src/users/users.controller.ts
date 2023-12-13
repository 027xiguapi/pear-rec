import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/current')
  findCurrent(): Promise<User> {
    return this.usersService.findCurrent();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post('/edit/:id')
  update(@Param('id') id: number, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Post('/delete/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
