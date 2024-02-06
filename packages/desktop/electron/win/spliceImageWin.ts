import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DIST, ICON, WEB_URL, preload, url } from '../main/contract';

const spliceImageHtml = join(DIST, './spliceImage.html');
let spliceImageWin: BrowserWindow | null = null;

function createSpliceImageWin(): BrowserWindow {
  spliceImageWin = new BrowserWindow({
    title: 'pear-rec 拼接图片',
    icon: ICON,
    height: 768,
    width: 1024,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // spliceImageWin.webContents.openDevTools();
  if (url) {
    spliceImageWin.loadURL(WEB_URL + `spliceImage.html`);
  } else {
    spliceImageWin.loadFile(spliceImageHtml);
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
