import { app, BrowserWindow, dialog, shell, screen, Rectangle } from 'electron';
import { join, basename, dirname } from 'node:path';
import { preload, url, DIST, ICON, WEB_URL, DIST_ELECTRON } from '../main/contract';
import {
  closeClipScreenWin,
  getBoundsClipScreenWin,
  setBoundsClipScreenWin,
} from './clipScreenWin';

const recorderScreenHtml = join(DIST, './recorderScreen.html');
let recorderScreenWin: BrowserWindow | null = null;

function createRecorderScreenWin(search?: any): BrowserWindow {
  const { x, y, width, height } = getBoundsClipScreenWin() as Rectangle;
  let recorderScreenWinX = x;
  let recorderScreenWinY = y + height;

  recorderScreenWin = new BrowserWindow({
    title: 'pear-rec 录屏',
    icon: ICON,
    x: recorderScreenWinX,
    y: recorderScreenWinY,
    width: width,
    height: 34,
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
  recorderScreenWin?.setResizable(false);
  if (url) {
    recorderScreenWin.loadURL(WEB_URL + `recorderScreen.html?type=${search?.type || ''}`);
    // recorderScreenWin.webContents.openDevTools();
  } else {
    recorderScreenWin.loadFile(recorderScreenHtml, {
      search: `?type=${search?.type || ''}`,
    });
  }

  recorderScreenWin.on('move', () => {
    const recorderScreenWinBounds = getBoundsRecorderScreenWin() as Rectangle;
    const clipScreenWinBounds = getBoundsClipScreenWin() as Rectangle;
    setBoundsClipScreenWin({
      x: recorderScreenWinBounds.x,
      y: recorderScreenWinBounds.y - clipScreenWinBounds.height,
      width: clipScreenWinBounds.width,
      height: clipScreenWinBounds.height,
    });
  });

  return recorderScreenWin;
}

// 打开关闭录屏窗口
function closeRecorderScreenWin() {
  recorderScreenWin?.isDestroyed() || recorderScreenWin?.close();
  recorderScreenWin = null;
  closeClipScreenWin();
}

function openRecorderScreenWin(search?: any) {
  if (!recorderScreenWin || recorderScreenWin?.isDestroyed()) {
    recorderScreenWin = createRecorderScreenWin(search);
  }
  recorderScreenWin?.show();
}

function hideRecorderScreenWin() {
  recorderScreenWin?.hide();
}

function showRecorderScreenWin() {
  recorderScreenWin?.show();
}

function minimizeRecorderScreenWin() {
  recorderScreenWin?.minimize();
}

function setSizeRecorderScreenWin(width: number, height: number) {
  recorderScreenWin?.setResizable(true);
  recorderScreenWin?.setSize(width, height);
  recorderScreenWin?.setResizable(false);
}

function getBoundsRecorderScreenWin() {
  return recorderScreenWin?.getBounds();
}

function setMovableRecorderScreenWin(movable: boolean) {
  recorderScreenWin?.setMovable(movable);
}

function setResizableRecorderScreenWin(resizable: boolean) {
  recorderScreenWin?.setResizable(resizable);
}

function setAlwaysOnTopRecorderScreenWin(isAlwaysOnTop: boolean) {
  recorderScreenWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function isFocusedRecorderScreenWin() {
  return recorderScreenWin?.isFocused();
}

function focusRecorderScreenWin() {
  recorderScreenWin?.focus();
}

function getCursorScreenPointRecorderScreenWin() {
  return screen.getCursorScreenPoint();
}

function setBoundsRecorderScreenWin(clipScreenWinBounds: any) {
  let { x, y, width, height } = clipScreenWinBounds;
  let recorderScreenWinX = x;
  let recorderScreenWinY = y + height;
  recorderScreenWin?.setBounds({
    x: recorderScreenWinX,
    y: recorderScreenWinY,
    width: width,
  });
  recorderScreenWin?.webContents.send('rs:get-size-clip-win', clipScreenWinBounds);
}

function setIgnoreMouseEventsRecorderScreenWin(event: any, ignore: boolean, options: any) {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.setIgnoreMouseEvents(ignore, options);
}

export {
  createRecorderScreenWin,
  closeRecorderScreenWin,
  openRecorderScreenWin,
  hideRecorderScreenWin,
  showRecorderScreenWin,
  minimizeRecorderScreenWin,
  setSizeRecorderScreenWin,
  setIgnoreMouseEventsRecorderScreenWin,
  getBoundsRecorderScreenWin,
  setMovableRecorderScreenWin,
  setResizableRecorderScreenWin,
  setAlwaysOnTopRecorderScreenWin,
  getCursorScreenPointRecorderScreenWin,
  isFocusedRecorderScreenWin,
  focusRecorderScreenWin,
  setBoundsRecorderScreenWin,
};
