import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let spliceImageWin: BrowserWindow | null = null;

function createSpliceImageWin(): BrowserWindow {
  spliceImageWin = new BrowserWindow({
    title: 'pear-rec 拼接图片',
    icon: ICON,
    height: WIN_CONFIG.spliceImage.height,
    width: WIN_CONFIG.spliceImage.width,
    autoHideMenuBar: WIN_CONFIG.spliceImage.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // spliceImageWin.webContents.openDevTools();
  if (url) {
    spliceImageWin.loadURL(WEB_URL + `spliceImage.html`);
  } else {
    spliceImageWin.loadFile(WIN_CONFIG.spliceImage.html);
  }

  spliceImageWin.once('ready-to-show', async () => {
    spliceImageWin?.show();
  });

  return spliceImageWin;
}

function openSpliceImageWin() {
  if (!spliceImageWin || spliceImageWin?.isDestroyed()) {
    spliceImageWin = createSpliceImageWin();
  }
  spliceImageWin.show();
}

function closeSpliceImageWin() {
  spliceImageWin?.close();
}

export { closeSpliceImageWin, createSpliceImageWin, openSpliceImageWin };
