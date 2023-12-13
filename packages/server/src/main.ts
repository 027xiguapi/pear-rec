import * as fs from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initConfig, getConfig } from './config';
import { PORT } from './contract';
import * as multer from 'multer';

async function bootstrap() {
  initConfig();

  const app = await NestFactory.create(AppModule, { cors: true, bodyParser: false });

  const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const { type, userId } = req.body;
      const config = getConfig();
      const user = config.user;
      try {
        const filePath = join(config?.filePath, `${user.uuid}/${type}`);
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
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
      };
      const type = req.body.type;
      const fileType = fileTypeMap[type] || 'webm';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${type}-${uniqueSuffix}.${fileType}`;
      cb(null, fileName);
    },
  });

  app.use(multer({ storage }).single('file'));

  await app.listen(PORT);

  console.log(`Server application is up and running on port ${PORT}`);
}
bootstrap();
