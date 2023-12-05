import { app, BrowserWindow, dialog, shell, screen, Rectangle } from 'electron';
import { join, basename, dirname } from 'node:path';
import { preload, url, DIST, ICON, WEB_URL, DIST_ELECTRON } from '../main/contract';

const recorderFullScreenHtml = join(DIST, './recordeFullScreen.html');
let recorderFullScreenWin: BrowserWindow | null = null;

function createRecorderFullScreenWin(): BrowserWindow {
  recorderFullScreenWin = new BrowserWindow({
    title: 'pear-rec 录屏',
    icon: ICON,
    height: 40,
    width: 365,
    center: true,
    transparent: true, // 使窗口透明
    autoHideMenuBar: true, // 自动隐藏菜单栏
    frame: false, // 无边框窗口
    hasShadow: false, // 窗口是否有阴影
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    skipTaskbar: true,
    webPreferences: {
      preload,
    },
  });
  recorderFullScreenWin?.setBounds({ y: 0 });
  recorderFullScreenWin?.setResizable(false);
  if (url) {
    recorderFullScreenWin.loadURL(WEB_URL + `recorderFullScreen.html`);
    // recorderFullScreenWin.webContents.openDevTools();
  } else {
    recorderFullScreenWin.loadFile(recorderFullScreenHtml);
  }

  return recorderFullScreenWin;
}

function closeRecorderFullScreenWin() {
  recorderFullScreenWin?.isDestroyed() || recorderFullScreenWin?.close();
  recorderFullScreenWin = null;
}

function openRecorderFullScreenWin() {
  if (!recorderFullScreenWin || recorderFullScreenWin?.isDestroyed()) {
    recorderFullScreenWin = createRecorderFullScreenWin();
  }
  recorderFullScreenWin?.show();
}

function hideRecorderFullScreenWin() {
  recorderFullScreenWin?.hide();
}

function showRecorderFullScreenWin() {
  recorderFullScreenWin?.show();
}

function minimizeRecorderFullScreenWin() {
  recorderFullScreenWin?.minimize();
}

function setMovableRecorderFullScreenWin(movable: boolean) {
  recorderFullScreenWin?.setMovable(movable);
}

function setAlwaysOnTopRecorderFullScreenWin(isAlwaysOnTop: boolean) {
  recorderFullScreenWin?.setAlwaysOnTop(isAlwaysOnTop);
}

export {
  createRecorderFullScreenWin,
  closeRecorderFullScreenWin,
  openRecorderFullScreenWin,
  hideRecorderFullScreenWin,
  showRecorderFullScreenWin,
  minimizeRecorderFullScreenWin,
  setMovableRecorderFullScreenWin,
  setAlwaysOnTopRecorderFullScreenWin,
};
