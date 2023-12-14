import { Controller, Get, Post, StreamableFile, Query, Res } from '@nestjs/common';
import { join, dirname, basename, extname } from 'node:path';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { readdirSync, createReadStream, statSync } from 'node:fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { AppService } from './app.service';
import { Record } from '../records/entity/record.entity';
import { exec } from 'child_process';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/audio')
  getAudio(@Query() query, @Res({ passthrough: true }) res: Response): StreamableFile {
    const stream = createReadStream(query.url);
    const stat = statSync(query.url);
    const fileSize = stat.size;
    res.set({
      'Content-Type': 'audio/mp3',
      'Content-Length': fileSize,
    });
    return new StreamableFile(stream);
  }

  @Get('/video')
  getVideo(@Query() query, @Res({ passthrough: true }) res: Response): StreamableFile {
    const stream = createReadStream(query.url);
    const stat = statSync(query.url);
    const fileSize = stat.size;
    res.set({
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    return new StreamableFile(stream);
  }

  @Get('/getImgs')
  getImgs(@Query() query) {
    const imgUrl = query.imgUrl;
    let imgs: any[] = [];
    let index = 0;
    let currentIndex = 0;
    try {
      const directoryPath = dirname(imgUrl);
      const files = readdirSync(directoryPath); // 读取目录内容
      files.forEach((file) => {
        const filePath = join(directoryPath, file);
        function isImgFile(filePath: string): boolean {
          const ext = extname(filePath).toLowerCase();
          return [
            '.jpg',
            '.jpeg',
            '.jfif',
            '.pjpeg',
            '.pjp',
            '.png',
            'apng',
            '.gif',
            '.bmp',
            '.avif',
            '.webp',
            '.ico',
          ].includes(ext);
        }
        const port = process.env.PORT || 9190;
        const protocol = `http://localhost:${port}/file?url=`;
        if (isImgFile(filePath)) {
          filePath == imgUrl && (currentIndex = index);
          imgs.push({
            url: `${protocol}${filePath}`,
            filePath: filePath,
            index,
          });
          index++;
        }
      });
    } catch (err) {
      console.log('getImgsByImgUrl', err);
    }
    return { imgs, currentIndex };
  }

  @Get('/getAudios')
  async getAudios(@Query() query): Promise<any[]> {
    const audioUrl = query.audioUrl;
    const directoryPath = dirname(audioUrl);
    const files = readdirSync(directoryPath); // 读取目录内容
    let audios: any[] = [];
    let index = 0;
    files.forEach((file) => {
      const filePath = join(directoryPath, file);
      const port = process.env.PORT || 9190;
      const protocol = `http://localhost:${port}/audio?url=`;
      function isAudioFile(filePath: string): boolean {
        const ext = extname(filePath).toLowerCase();
        return [
          '.mp3',
          '.wav',
          '.aac',
          '.ogg',
          '.flac',
          '.aiff',
          '.aif',
          '.m4a',
          '.alac',
          '.ac3',
          '.webm',
        ].includes(ext);
      }
      if (isAudioFile(filePath)) {
        const fileName = basename(filePath);
        if (filePath == audioUrl) {
          audios.unshift({
            url: `${protocol}${filePath}`,
            name: fileName,
            cover: './imgs/music.png',
          });
        } else {
          audios.push({
            url: `${protocol}${filePath}`,
            name: fileName,
            cover: './imgs/music.png',
          });
        }
        index++;
      }
    });

    return audios;
  }

  @Get('/getVideos')
  getVideos(@Query() query) {
    const videoUrl = query.videoUrl;
    const directoryPath = dirname(videoUrl);
    const files = readdirSync(directoryPath);
    let videos: any[] = [];
    let index = 0;
    let currentIndex = 0;
    files.forEach((file) => {
      const filePath = join(directoryPath, file);
      const port = process.env.PORT || 9190;
      const protocol = `http://localhost:${port}/video?url=`;
      function isVideoFile(filePath: string): boolean {
        const ext = extname(filePath).toLowerCase();
        return ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.webm'].includes(ext);
      }
      if (isVideoFile(filePath)) {
        const fileName = basename(filePath);
        filePath == videoUrl && (currentIndex = index);
        videos.push({
          url: `${protocol}${filePath}`,
          index,
          name: fileName,
        });
        index++;
      }
    });
    return { videos, currentIndex };
  }

  @Get('/getFolder')
  getFolder(@Query() query): string {
    const folderPath = query.folderPath;
    exec(`start "" "${folderPath}"`);
    return 'ok';
  }

  @Get('/openFilePath')
  openFilePath(@Query() query): string {
    const filePath = query.filePath as string;
    const folderPath = dirname(filePath);
    exec(`start "" "${folderPath}"`);
    return 'ok';
  }
}
