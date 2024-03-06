import { BrowserWindow, shell } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let settingWin: BrowserWindow | null = null;

function createSettingWin(): BrowserWindow {
  settingWin = new BrowserWindow({
    title: 'pear-rec 设置',
    icon: ICON,
    autoHideMenuBar: WIN_CONFIG.setting.autoHideMenuBar, // 自动隐藏菜单栏
    width: WIN_CONFIG.setting.width, // 宽度(px)
    height: WIN_CONFIG.setting.height, // 高度(px)
    webPreferences: {
      preload,
    },
  });

  // settingWin.webContents.openDevTools();
  if (url) {
    settingWin.loadURL(WEB_URL + 'setting.html');
  } else {
    settingWin.loadFile(WIN_CONFIG.setting.html);
  }

  settingWin.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

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

export { closeSettingWin, createSettingWin, hideSettingWin, openSettingWin, showSettingWin };
