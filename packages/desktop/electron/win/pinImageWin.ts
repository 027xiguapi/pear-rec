import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let pinImageWin: BrowserWindow | null = null;

function createPinImageWin(search?: any): BrowserWindow {
  pinImageWin = new BrowserWindow({
    title: 'pear-rec 图片',
    icon: ICON,
    frame: WIN_CONFIG.pinImage.frame, // 无边框窗口
    resizable: WIN_CONFIG.pinImage.resizable, // 窗口大小是否可调整
    transparent: WIN_CONFIG.pinImage.transparent, // 使窗口透明
    fullscreenable: WIN_CONFIG.pinImage.fullscreenable, // 窗口是否可以进入全屏状态
    alwaysOnTop: WIN_CONFIG.pinImage.alwaysOnTop, // 窗口是否永远在别的窗口的上面
    autoHideMenuBar: WIN_CONFIG.pinImage.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const imgUrl = search?.imgUrl || '';
  // pinImageWin.webContents.openDevTools();
  if (url) {
    pinImageWin.loadURL(WEB_URL + `pinImage.html?imgUrl=${imgUrl}`);
  } else {
    pinImageWin.loadFile(WIN_CONFIG.pinImage.html, {
      search: `?imgUrl=${imgUrl}`,
    });
  }

  return pinImageWin;
}

// 打开关闭录屏窗口
function closePinImageWin() {
  pinImageWin?.isDestroyed() || pinImageWin?.close();
  pinImageWin = null;
}

function openPinImageWin(search?: any) {
  pinImageWin = createPinImageWin(search);
  pinImageWin?.show();
}

function showPinImageWin() {
  pinImageWin?.show();
}

function hidePinImageWin() {
  pinImageWin?.hide();
}

function minimizePinImageWin() {
  pinImageWin?.minimize();
}

function maximizePinImageWin() {
  pinImageWin?.maximize();
}

function unmaximizePinImageWin() {
  pinImageWin?.unmaximize();
}

export {
  closePinImageWin,
  createPinImageWin,
  hidePinImageWin,
  maximizePinImageWin,
  minimizePinImageWin,
  openPinImageWin,
  showPinImageWin,
  unmaximizePinImageWin,
};
