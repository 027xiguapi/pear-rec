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

  async uploadFile(file: Express.Multer.File, fileDto: CreateFileDto): Promise<Record> {
    const user = await this.usersService.findOne(fileDto.userId);
    let record = {
      filePath: file.path,
      fileType: fileDto.type,
      user: user,
      createdBy: user.id,
    };

    return this.recordsService.create(record);
  }

  async cacheFile(file: Express.Multer.File, fileDto: CreateFileDto): Promise<string> {
    return file.path;
  }
}
