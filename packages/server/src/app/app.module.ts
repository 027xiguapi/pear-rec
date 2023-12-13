import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Record } from '../records/entity/record.entity';
import { Setting } from '../settings/entity/setting.entity';
import { DB_PATH } from '../contract';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { RecordsModule } from '../records/records.module';
import { SettingsModule } from '../settings/settings.module';
import { ResponseInterceptor } from '../util/response.interceptor';
import { AllExceptionsFilter } from '../util/exception.filter';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: DB_PATH,
      autoSave: true,
      entities: [User, Record, Setting],
      synchronize: true,
      logging: true,
      logger: 'file',
    }),
    UsersModule,
    RecordsModule,
    SettingsModule,
  ],
  controllers: [AppController],
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
export class AppModule {}
