import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initConfig } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  initConfig();

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  await app.listen(PORT);

  console.log(`Server application is up and running on port ${PORT}`);
}
bootstrap();
