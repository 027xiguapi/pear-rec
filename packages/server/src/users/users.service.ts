import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { getConfig } from '../config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findCurrent(): Promise<User | null> {
    const config = getConfig();
    return this.usersRepository.findOneBy({ uuid: config.user.uuid });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async update(id: number, user: User): Promise<User> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
