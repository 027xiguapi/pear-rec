import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { getConfig } from '../config';

@Injectable()
export class UploadMiddleware implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: async function (req, file, cb) {
          const { type, userId } = req.body;
          const config = getConfig();
          const user = config.user;
          try {
            const filePath = join(config?.filePath, `${user.uuid}/${type}`);
            if (!existsSync(filePath)) {
              mkdirSync(filePath, { recursive: true });
            }
            cb(null, filePath);
          } catch (err) {
            console.log('saveFile err', err);
          }
        },
        filename: function (req, file, cb) {
          const fileTypeMap = {
            ss: 'png',
            rs: 'webm',
            ra: 'webm',
            ei: 'png',
            eg: 'gif',
          };
          const type = req.body.type;
          const fileType = fileTypeMap[type] || 'webm';
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${type}-${uniqueSuffix}.${fileType}`;
          cb(null, fileName);
        },
      }),
    };
  }
}
