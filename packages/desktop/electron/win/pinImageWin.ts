import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DIST, ICON, preload, url, WEB_URL } from '../main/constant';

const pinImageHtml = join(DIST, './pinImage.html');
let pinImageWin: BrowserWindow | null = null;

function createPinImageWin(search?: any): BrowserWindow {
  pinImageWin = new BrowserWindow({
    title: 'pear-rec 图片',
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

  const imgUrl = search?.imgUrl || '';
  // pinImageWin.webContents.openDevTools();
  if (url) {
    pinImageWin.loadURL(WEB_URL + `pinImage.html?imgUrl=${imgUrl}`);
  } else {
    pinImageWin.loadFile(pinImageHtml, {
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
