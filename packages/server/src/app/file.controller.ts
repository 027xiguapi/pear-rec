import {
  Controller,
  Get,
  Post,
  StreamableFile,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { AppService } from './app.service';
import { Record } from '../records/entity/record.entity';

@Controller('/file')
export class FileController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getFile(@Query() query): StreamableFile {
    const file = createReadStream(query.url);
    return new StreamableFile(file);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ): Promise<Record> {
    return this.appService.uploadFile(file, createFileDto.userId);
  }
}
