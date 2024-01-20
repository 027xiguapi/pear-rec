import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DIST, ICON, preload, url, WEB_URL } from '../main/contract';

const pinVideoHtml = join(DIST, './pinVideo.html');
let pinVideoWin: BrowserWindow | null = null;

function createPinVideoWin(search?: any): BrowserWindow {
  pinVideoWin = new BrowserWindow({
    title: 'pear-rec 视频',
    icon: ICON,
    height: 450,
    width: 600,
    frame: false, // 无边框窗口
    resizable: true, // 窗口大小是否可调整
    transparent: true, // 使窗口透明
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // pinVideoWin.webContents.openDevTools();
  if (url) {
    pinVideoWin.loadURL(WEB_URL + `pinVideo.html`);
  } else {
    pinVideoWin.loadFile(pinVideoHtml);
  }

  return pinVideoWin;
}

// 打开关闭录屏窗口
function closePinVideoWin() {
  pinVideoWin?.isDestroyed() || pinVideoWin?.close();
  pinVideoWin = null;
}

function openPinVideoWin(search?: any) {
  pinVideoWin = createPinVideoWin(search);
  pinVideoWin?.show();
}

function showPinVideoWin() {
  pinVideoWin?.show();
}

function hidePinVideoWin() {
  pinVideoWin?.hide();
}

function minimizePinVideoWin() {
  pinVideoWin?.minimize();
}

function maximizePinVideoWin() {
  pinVideoWin?.maximize();
}

function unmaximizePinVideoWin() {
  pinVideoWin?.unmaximize();
}

export {
  closePinVideoWin,
  createPinVideoWin,
  hidePinVideoWin,
  maximizePinVideoWin,
  minimizePinVideoWin,
  openPinVideoWin,
  showPinVideoWin,
  unmaximizePinVideoWin,
};
