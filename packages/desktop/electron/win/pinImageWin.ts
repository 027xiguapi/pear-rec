import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let pinImageWin: BrowserWindow | null = null;

function createPinImageWin(search?: any): BrowserWindow {
  const imgUrl = search?.imgUrl || '';
  const recordId = search?.recordId || '';
  const width = search?.width || 800;
  const height = search?.height || 600;

  pinImageWin = new BrowserWindow({
    title: 'pear-rec 图片',
    icon: ICON,
    width: width,
    height: height,
    frame: WIN_CONFIG.pinImage.frame, // 无边框窗口
    transparent: WIN_CONFIG.pinImage.transparent, // 使窗口透明
    fullscreenable: WIN_CONFIG.pinImage.fullscreenable, // 窗口是否可以进入全屏状态
    alwaysOnTop: WIN_CONFIG.pinImage.alwaysOnTop, // 窗口是否永远在别的窗口的上面
    autoHideMenuBar: WIN_CONFIG.pinImage.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  if (url) {
    pinImageWin.loadURL(
      WEB_URL +
        `pinImage.html?${imgUrl ? 'imgUrl=' + imgUrl : ''}${
          recordId ? 'recordId=' + recordId : ''
        }`,
    );
    // pinImageWin.webContents.openDevTools();
  } else {
    pinImageWin.loadFile(WIN_CONFIG.pinImage.html, {
      search: `?${imgUrl ? 'imgUrl=' + imgUrl : ''}${recordId ? 'recordId=' + recordId : ''}`,
    });
  }

  return pinImageWin;
}

function setSizePinImageWin(size: any) {
  pinImageWin.setBounds(size);
}

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

function getSizePinImageWin() {
  return pinImageWin.getBounds();
}

export {
  setSizePinImageWin,
  closePinImageWin,
  createPinImageWin,
  hidePinImageWin,
  maximizePinImageWin,
  minimizePinImageWin,
  openPinImageWin,
  showPinImageWin,
  unmaximizePinImageWin,
  getSizePinImageWin,
};
