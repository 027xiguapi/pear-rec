import { AppDataSource } from '../dataSource';
import { Setting } from '../entity/Setting';
import { UserController } from '../controller/UserController';
import { getDefaultConfig, resetConfig, editConfig } from '../config';

const userController = new UserController();
export class SettingController {
  async getSettings(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const settings = await settingRepository.find();
    res.json({ code: 0, data: settings });
  }

  async createSetting(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const setting = settingRepository.create(req.body);
    await settingRepository.save(setting);
    res.json({ code: 0, data: setting });
  }

  async getSetting(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const setting = await settingRepository.findOneBy({ id: req.params.id });

    if (!setting) {
      return res.json({ code: -1, data: 'setting not found' });
    }

    res.json({ code: 0, data: setting });
  }

  async getSettingByUserId(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const userId = req.params.userId;
    const setting = await settingRepository
      .createQueryBuilder('setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!setting) {
      const user = await userController._getUserById(userId);
      const defaultConfig = getDefaultConfig();
      let _setting = {
        isProxy: defaultConfig.isProxy,
        proxyPort: defaultConfig.proxyPort,
        language: defaultConfig.language,
        filePath: defaultConfig.filePath,
        openAtLogin: defaultConfig.openAtLogin,
        serverPath: defaultConfig.serverPath,
        user: user,
      };
      _setting = await settingRepository.save(_setting);
      return res.json({ code: 0, data: _setting });
    }

    res.json({ code: 0, data: setting });
  }

  async resetSetting(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const setting = await settingRepository.findOneBy({ id: req.params.id });

    if (!setting) {
      return res.json({ code: -1, data: 'setting not found' });
    }
    let defaultConfig = getDefaultConfig();
    let _setting = {
      isProxy: defaultConfig.isProxy,
      proxyPort: defaultConfig.proxyPort,
      language: defaultConfig.language,
      filePath: defaultConfig.filePath,
      openAtLogin: defaultConfig.openAtLogin,
      serverPath: defaultConfig.serverPath,
    };
    settingRepository.merge(setting, _setting);
    await settingRepository.save(setting);
    resetConfig();
    res.json({ code: 0, data: setting });
  }

  async updateSetting(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const setting = await settingRepository.findOneBy({ id: req.params.id });

    if (!setting) {
      return res.json({ code: -1, data: 'setting not found' });
    }
    const _setting = req.body;
    settingRepository.merge(setting, _setting);
    await settingRepository.save(setting);
    for (let key in _setting) {
      let value = _setting[key];
      editConfig(key, value);
    }
    res.json({ code: 0, data: setting });
  }

  async deleteSetting(req, res) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const setting = await settingRepository.findOneBy({ id: req.params.id });

    if (!setting) {
      return res.json({ code: -1, data: 'setting not found' });
    }

    await settingRepository.remove(setting);
    res.json({ code: 0, data: 'setting deleted successfully' });
  }

  async _getSettingByUserId(userId) {
    const settingRepository = AppDataSource.getRepository(Setting);
    const setting = await settingRepository
      .createQueryBuilder('setting')
      .leftJoinAndSelect('setting.user', 'user')
      .where('user.id = :id', { id: userId })
      .getOne();

    return setting;
  }
}
