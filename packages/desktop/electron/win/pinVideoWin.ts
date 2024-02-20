import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let pinVideoWin: BrowserWindow | null = null;

function createPinVideoWin(search?: any): BrowserWindow {
  pinVideoWin = new BrowserWindow({
    title: 'pear-rec 视频',
    icon: ICON,
    height: WIN_CONFIG.pinVideo.height,
    width: WIN_CONFIG.pinVideo.width,
    frame: WIN_CONFIG.pinVideo.frame, // 无边框窗口
    resizable: WIN_CONFIG.pinVideo.resizable, // 窗口大小是否可调整
    transparent: WIN_CONFIG.pinVideo.transparent, // 使窗口透明
    fullscreenable: WIN_CONFIG.pinVideo.fullscreenable, // 窗口是否可以进入全屏状态
    alwaysOnTop: WIN_CONFIG.pinVideo.alwaysOnTop, // 窗口是否永远在别的窗口的上面
    autoHideMenuBar: WIN_CONFIG.pinVideo.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // pinVideoWin.webContents.openDevTools();
  if (url) {
    pinVideoWin.loadURL(WEB_URL + `pinVideo.html`);
  } else {
    pinVideoWin.loadFile(WIN_CONFIG.pinVideo.html);
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
