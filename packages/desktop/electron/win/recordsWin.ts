import { app, BrowserWindow, shell } from 'electron';
import { join } from 'node:path';
import { ICON, preload, url, DIST, WEB_URL } from '../main/contract';

const recordsHtml = join(DIST, './records.html');
let recordsWin: BrowserWindow | null = null;

function createRecordsWin(): BrowserWindow {
  recordsWin = new BrowserWindow({
    title: 'pear-rec 记录',
    icon: ICON,
    width: 1000,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // recordsWin.webContents.openDevTools();
  if (url) {
    recordsWin.loadURL(WEB_URL + 'records.html');
  } else {
    recordsWin.loadFile(recordsHtml);
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

export { createRecordsWin, closeRecordsWin, openRecordsWin, showRecordsWin, hideRecordsWin };
