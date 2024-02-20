import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let recordsWin: BrowserWindow | null = null;

function createRecordsWin(): BrowserWindow {
  recordsWin = new BrowserWindow({
    title: 'pear-rec 记录',
    icon: ICON,
    width: WIN_CONFIG.records.width,
    autoHideMenuBar: WIN_CONFIG.records.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // recordsWin.webContents.openDevTools();
  if (url) {
    recordsWin.loadURL(WEB_URL + 'records.html');
  } else {
    recordsWin.loadFile(WIN_CONFIG.records.html);
  }

  return recordsWin;
}

// 打开关闭录屏窗口
function closeRecordsWin() {
  recordsWin?.isDestroyed() || recordsWin?.close();
  recordsWin = null;
}

function openRecordsWin() {
  if (!recordsWin || recordsWin?.isDestroyed()) {
    recordsWin = createRecordsWin();
  }
  recordsWin?.show();
}

function showRecordsWin() {
  recordsWin?.show();
}

function hideRecordsWin() {
  recordsWin?.hide();
}

export { closeRecordsWin, createRecordsWin, hideRecordsWin, openRecordsWin, showRecordsWin };
