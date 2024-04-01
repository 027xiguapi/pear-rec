import { Menu, Tray, app, shell } from 'electron';
import { ICON } from './constant';
import { openMainWin } from '../win/mainWin';
import { showShotScreenWin } from '../win/shotScreenWin';
import { openClipScreenWin } from '../win/clipScreenWin';
import { openRecorderAudioWin } from '../win/recorderAudioWin';
import { openRecorderVideoWin } from '../win/recorderVideoWin';
import { openViewImageWin } from '../win/viewImageWin';
import { openViewVideoWin } from '../win/viewVideoWin';
import { openViewAudioWin } from '../win/viewAudioWin';
import { openSettingWin } from '../win/settingWin';
import * as zhCN from '../i18n/zh-CN.json';
import * as enUS from '../i18n/en-US.json';
import * as deDE from '../i18n/de-DE.json';

const lngMap = {
  zh: zhCN,
  en: enUS,
  de: deDE,
} as any;

export function initTray(lng: string) {
  let appIcon = new Tray(ICON);
  const t = lngMap[lng].tray;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: t.screenshot,
      click: () => {
        showShotScreenWin();
      },
    },
    {
      label: t.screenRecording,
      click: () => {
        openClipScreenWin();
      },
    },
    {
      label: t.audioRecording,
      click: () => {
        openRecorderAudioWin();
      },
    },
    {
      label: t.videoRecording,
      click: () => {
        openRecorderVideoWin();
      },
    },
    {
      type: 'separator',
    },
    {
      label: t.viewImage,
      click: () => {
        openViewImageWin();
      },
    },
    {
      label: t.watchVideo,
      click: () => {
        openViewVideoWin();
      },
    },
    {
      label: t.playAudio,
      click: () => {
        openViewAudioWin();
      },
    },
    // {
    // 	type: "separator",
    // },
    // {
    // 	label: "开机自启动",
    // 	type: "checkbox",
    // 	checked: true,
    // 	click: (i) => {
    // 		app.setLoginItemSettings({ openAtLogin: i.checked });
    // 	},
    // },
    {
      type: 'separator',
    },
    {
      label: t.home,
      click: () => {
        openMainWin();
      },
    },
    {
      label: t.setting,
      click: () => {
        openSettingWin();
      },
    },
    {
      label: t.help,
      click: () => {
        shell.openExternal('https://027xiguapi.github.io/pear-rec/');
      },
    },
    {
      type: 'separator',
    },
    {
      label: t.relaunch,
      click: () => {
        app.relaunch();
        app.exit(0);
      },
    },
    {
      label: t.quit,
      click: () => {
        app.quit();
      },
    },
  ]);
  appIcon.setToolTip('梨子REC');
  appIcon.setContextMenu(contextMenu);
  appIcon.addListener('click', function () {
    openMainWin();
  });
  return appIcon;
}
