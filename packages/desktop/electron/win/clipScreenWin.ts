import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';
import {
  hideRecorderScreenWin,
  openRecorderScreenWin,
  setBoundsRecorderScreenWin,
  showRecorderScreenWin,
} from './recorderScreenWin';

let clipScreenWin: BrowserWindow | null = null;

function createClipScreenWin(): BrowserWindow {
  clipScreenWin = new BrowserWindow({
    title: 'pear-rec',
    icon: ICON,
    autoHideMenuBar: WIN_CONFIG.clipScreen.autoHideMenuBar, // 自动隐藏菜单栏
    frame: WIN_CONFIG.clipScreen.frame, // 无边框窗口
    resizable: WIN_CONFIG.clipScreen.resizable, // 窗口大小是否可调整
    transparent: WIN_CONFIG.clipScreen.transparent, // 使窗口透明
    fullscreenable: WIN_CONFIG.clipScreen.fullscreenable, // 窗口是否可以进入全屏状态
    alwaysOnTop: WIN_CONFIG.clipScreen.alwaysOnTop, // 窗口是否永远在别的窗口的上面
    skipTaskbar: WIN_CONFIG.clipScreen.skipTaskbar,
    webPreferences: {
      preload,
    },
  });

  // clipScreenWin.webContents.openDevTools();
  if (url) {
    clipScreenWin.loadURL(WEB_URL + 'clipScreen.html');
  } else {
    clipScreenWin.loadFile(WIN_CONFIG.clipScreen.html);
  }

  // clipScreenWin.on('resize', () => {
  //   const clipScreenWinBounds = getBoundsClipScreenWin();
  //   setBoundsRecorderScreenWin(clipScreenWinBounds);
  // });

  // clipScreenWin.on('move', () => {
  //   const clipScreenWinBounds = getBoundsClipScreenWin();
  //   setBoundsRecorderScreenWin(clipScreenWinBounds);
  // });

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
