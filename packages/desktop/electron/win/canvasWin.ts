import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DIST, ICON, WEB_URL, preload, url } from '../main/constant';

const canvasHtml = join(DIST, './canvas.html');
let canvasWin: BrowserWindow | null = null;

function createCanvasWin(): BrowserWindow {
  canvasWin = new BrowserWindow({
    title: 'pear-rec 画布',
    icon: ICON,
    height: 768,
    width: 1024,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // canvasWin.webContents.openDevTools();
  if (url) {
    canvasWin.loadURL(WEB_URL + `canvas.html`);
  } else {
    canvasWin.loadFile(canvasHtml);
  }

  canvasWin.once('ready-to-show', async () => {
    canvasWin?.show();
  });

  return canvasWin;
}

function openCanvasWin() {
  if (!canvasWin || canvasWin?.isDestroyed()) {
    canvasWin = createCanvasWin();
  }
  canvasWin.show();
}

function closeCanvasWin() {
  canvasWin?.close();
}

export { closeCanvasWin, createCanvasWin, openCanvasWin };
