import { SettingController } from '../controller/SettingController';

const settingController = new SettingController();

export const SettingRoutes = [
  {
    path: '/settings',
    method: 'get',
    action: settingController.getSettings,
  },
  {
    path: '/addSetting',
    method: 'post',
    action: settingController.createSetting,
  },
  {
    path: '/setting/:id',
    method: 'get',
    action: settingController.getSetting,
  },
  {
    path: '/getSettingByUserId/:userId',
    method: 'get',
    action: settingController.getSettingByUserId,
  },
  {
    path: '/editSetting/:id',
    method: 'post',
    action: settingController.updateSetting,
  },
  {
    path: '/deleteSettings/:id',
    method: 'get',
    action: settingController.deleteSetting,
  },
  {
    path: '/resetSetting/:id',
    method: 'get',
    action: settingController.resetSetting,
  },
];
