import { app, BrowserWindow, shell } from 'electron';
import { join } from 'node:path';
import { ICON, preload, url, DIST, WEB_URL } from '../main/contract';

const settingHtml = join(DIST, './setting.html');
let settingWin: BrowserWindow | null = null;

function createSettingWin(): BrowserWindow {
  settingWin = new BrowserWindow({
    title: 'pear-rec 设置',
    icon: ICON,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    width: 600, // 宽度(px)
    height: 380, // 高度(px)
    webPreferences: {
      preload,
    },
  });

  // settingWin.webContents.openDevTools();
  if (url) {
    settingWin.loadURL(WEB_URL + 'setting.html');
  } else {
    settingWin.loadFile(settingHtml);
  }

  return settingWin;
}

// 打开关闭录屏窗口
function closeSettingWin() {
  settingWin?.isDestroyed() || settingWin?.close();
  settingWin = null;
}

function openSettingWin() {
  if (!settingWin || settingWin?.isDestroyed()) {
    settingWin = createSettingWin();
  }
  settingWin?.show();
}

function showSettingWin() {
  settingWin?.show();
}

function hideSettingWin() {
  settingWin?.hide();
}

export { createSettingWin, closeSettingWin, openSettingWin, showSettingWin, hideSettingWin };
