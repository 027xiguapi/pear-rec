import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entity/setting.entity';
import { UsersService } from '../users/users.service';
import { getDefaultConfig } from '../config';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly usersService: UsersService,
  ) {}

  async create(setting: Setting): Promise<Setting> {
    return await this.settingRepository.save(setting);
  }

  async findAll(): Promise<Setting[]> {
    return await this.settingRepository.find();
  }

  async findOne(id: number): Promise<Setting> {
    return await this.settingRepository.findOneBy({ id });
  }

  async findOneByUserId(userId: number): Promise<Setting> {
    let setting = await this.settingRepository
      .createQueryBuilder('setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (setting == null) {
      const defaultConfig = getDefaultConfig();
      const user = await this.usersService.findOne(userId);
      setting = {
        isProxy: defaultConfig.isProxy,
        proxyPort: defaultConfig.proxyPort,
        language: defaultConfig.language,
        filePath: defaultConfig.filePath,
        openAtLogin: defaultConfig.openAtLogin,
        serverPath: defaultConfig.serverPath,
        user: user,
        createdBy: user.id,
      } as any;

      return await this.settingRepository.save(setting);
    } else {
      return setting;
    }
  }

  async update(id: number, setting: Setting): Promise<Setting> {
    await this.settingRepository.update(id, setting);
    return await this.settingRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.settingRepository.delete(id);
  }

  async reset(id: number): Promise<Setting> {
    const defaultConfig = getDefaultConfig();
    let setting = {
      isProxy: defaultConfig.isProxy,
      proxyPort: defaultConfig.proxyPort,
      language: defaultConfig.language,
      filePath: defaultConfig.filePath,
      openAtLogin: defaultConfig.openAtLogin,
      serverPath: defaultConfig.serverPath,
    };
    await this.settingRepository.update(id, setting);
    return await this.settingRepository.findOneBy({ id });
  }
}
