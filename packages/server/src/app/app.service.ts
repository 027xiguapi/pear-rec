import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { Record } from '../records/entity/record.entity';
import { RecordsService } from '../records/records.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly usersService: UsersService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(fileDto: CreateFileDto): Promise<Record> {
    const userId = fileDto.userId;
    const user = await this.usersService.findOne(userId);
    let record = {
      filePath: fileDto.path,
      fileType: fileDto.type,
      user: user,
    };

    return this.recordsService.create(record);
  }
}
