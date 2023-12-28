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
import * as path from 'node:path';
import * as fs from 'node:fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { AppService } from './app.service';
import { Record } from '../records/entity/record.entity';
import { getConfig } from '../config';

@Controller('/file')
export class FileController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getFile(@Query() query): StreamableFile {
    const file = fs.createReadStream(query.url);
    return new StreamableFile(file);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ): Promise<Record> {
    return this.appService.uploadFile(file, createFileDto);
  }

  @Post('/cache')
  @UseInterceptors(FileInterceptor('file'))
  async cacheFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ): Promise<string> {
    return 'ok';
  }

  @Get('/cache')
  async getCacheFile(@Query() query): Promise<string> {
    const { type } = query;
    const config = getConfig();
    const user = config.user;
    const folderPath = path.join(config.filePath, `${user.uuid}/${type}`);
    return folderPath;
  }

  @Get('/cache/delete')
  async deleteCacheFile(@Query() query): Promise<string> {
    const { type } = query;
    const config = getConfig();
    const user = config.user;
    const folderPath = path.join(config.filePath, `${user.uuid}/${type}`);
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.unlinkSync(filePath);
      });
      fs.rmdirSync(folderPath);
      console.log(`文件夹 ${folderPath} 已成功删除`);
    }
    return 'ok';
  }
}
