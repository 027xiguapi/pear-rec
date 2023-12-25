import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initConfig } from './config';
import { ConfigService } from '@nestjs/config';

process.env.TZ = 'Asia/Shanghai';

async function bootstrap() {
  initConfig();

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  await app.listen('9190');

  console.log(`Server application is up and running on port ${9190}`);
}
bootstrap();
