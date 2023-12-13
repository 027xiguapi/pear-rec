import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DatabaseModule } from '../database/database.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { Setting } from './entity/setting.entity';
// import { settingsProviders } from './settings.providers';

@Module({
  // imports: [DatabaseModule],
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
