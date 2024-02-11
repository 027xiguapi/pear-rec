import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DIST, ICON, WEB_URL, preload, url } from '../main/constant';
import {
  hideRecorderScreenWin,
  openRecorderScreenWin,
  setBoundsRecorderScreenWin,
  showRecorderScreenWin,
} from './recorderScreenWin';

const clipScreenHtml = join(DIST, './clipScreen.html');
let clipScreenWin: BrowserWindow | null = null;

function createClipScreenWin(): BrowserWindow {
  clipScreenWin = new BrowserWindow({
    title: 'pear-rec_clipScreenWin',
    icon: ICON,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    frame: false, // 无边框窗口
    resizable: true, // 窗口大小是否可调整
    transparent: true, // 使窗口透明
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    // skipTaskbar: true,
    webPreferences: {
      preload,
    },
  });

  if (url) {
    clipScreenWin.loadURL(WEB_URL + 'clipScreen.html');
    // clipScreenWin.webContents.openDevTools();
  } else {
    clipScreenWin.loadFile(clipScreenHtml);
  }

  clipScreenWin.on('resize', () => {
    const clipScreenWinBounds = getBoundsClipScreenWin();
    setBoundsRecorderScreenWin(clipScreenWinBounds);
  });

  clipScreenWin.on('move', () => {
    const clipScreenWinBounds = getBoundsClipScreenWin();
    setBoundsRecorderScreenWin(clipScreenWinBounds);
  });

  clipScreenWin.on('restore', () => {
    showRecorderScreenWin();
  });

  clipScreenWin.on('minimize', () => {
    hideRecorderScreenWin();
  });

  return clipScreenWin;
}

function closeClipScreenWin() {
  clipScreenWin?.isDestroyed() || clipScreenWin?.close();
  clipScreenWin = null;
}

function showClipScreenWin() {
  clipScreenWin?.show();
}

function openClipScreenWin(search?: any) {
  if (!clipScreenWin || clipScreenWin?.isDestroyed()) {
    clipScreenWin = createClipScreenWin();
  }

  clipScreenWin?.show();
  openRecorderScreenWin(search);
}

function getBoundsClipScreenWin() {
  return clipScreenWin?.getBounds();
}

function hideClipScreenWin() {
  clipScreenWin?.hide();
}

function setAlwaysOnTopClipScreenWin(isAlwaysOnTop: boolean) {
  clipScreenWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function setMovableClipScreenWin(movable: boolean) {
  clipScreenWin?.setMovable(movable);
}

function setResizableClipScreenWin(resizable: boolean) {
  clipScreenWin?.setResizable(resizable);
}

function minimizeClipScreenWin() {
  clipScreenWin?.minimize();
}

function setIgnoreMouseEventsClipScreenWin(event: any, ignore: boolean, options?: any) {
  clipScreenWin?.setIgnoreMouseEvents(ignore, options);
}

function setIsPlayClipScreenWin(isPlay: boolean) {
  clipScreenWin?.webContents.send('cs:set-isPlay', isPlay);
}

function setBoundsClipScreenWin(bounds: any) {
  clipScreenWin?.setBounds({ ...bounds });
}

export {
  closeClipScreenWin,
  getBoundsClipScreenWin,
  hideClipScreenWin,
  minimizeClipScreenWin,
  openClipScreenWin,
  setAlwaysOnTopClipScreenWin,
  setBoundsClipScreenWin,
  setIgnoreMouseEventsClipScreenWin,
  setIsPlayClipScreenWin,
  setMovableClipScreenWin,
  setResizableClipScreenWin,
  showClipScreenWin,
};
