import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let canvasWin: BrowserWindow | null = null;

function createCanvasWin(): BrowserWindow {
  canvasWin = new BrowserWindow({
    title: 'pear-rec 画布',
    icon: ICON,
    height: WIN_CONFIG.canvas.height,
    width: WIN_CONFIG.canvas.width,
    autoHideMenuBar: WIN_CONFIG.canvas.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // canvasWin.webContents.openDevTools();
  if (url) {
    canvasWin.loadURL(WEB_URL + `canvas.html`);
  } else {
    canvasWin.loadFile(WIN_CONFIG.canvas.html);
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
