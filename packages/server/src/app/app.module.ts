import { join } from 'node:path';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Record } from '../records/entity/record.entity';
import { Setting } from '../settings/entity/setting.entity';
import { DB_PATH } from '../constant';
import { AppController } from './app.controller';
import { FileController } from './file.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { RecordsModule } from '../records/records.module';
import { SettingsModule } from '../settings/settings.module';
import { ResponseInterceptor } from '../util/response.interceptor';
import { AllExceptionsFilter } from '../util/exception.filter';
import configuration from '../util/configuration';
import { ProxyGoogle, ProxyBaidu } from '../util/proxy.middleware';
import { UploadMiddleware } from '../util/upload.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: DB_PATH,
      autoSave: true,
      entities: [User, Record, Setting],
      synchronize: true,
      logging: false,
      logger: 'file',
    }),
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    }),
    UsersModule,
    RecordsModule,
    SettingsModule,
  ],
  controllers: [AppController, FileController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyBaidu).forRoutes('/apiBaidu');
    consumer.apply(ProxyGoogle).forRoutes('/apiGoogle');
  }
}
