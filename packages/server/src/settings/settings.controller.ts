import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingsService } from './settings.service';
import { UsersService } from 'src/users/users.service';
import { Setting } from './entity/setting.entity';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Post()
  create(@Body() record: CreateSettingDto): Promise<Setting> {
    return this.settingsService.create(record);
  }

  @Get()
  findAll(): Promise<Setting[]> {
    return this.settingsService.findAll();
  }

  @Get('user/:id')
  async findOneByUserId(@Param('id') userId: number): Promise<Setting> {
    return this.settingsService.findOneByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Setting> {
    return this.settingsService.findOne(id);
  }

  @Post('/edit/:id')
  update(@Param('id') id: number, @Body() record: CreateSettingDto): Promise<Setting> {
    return this.settingsService.update(id, record);
  }

  @Post('/delete/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.settingsService.remove(id);
  }

  @Post('/reset/:id')
  reset(@Param('id') id: number): Promise<Setting> {
    return this.settingsService.reset(id);
  }
}
