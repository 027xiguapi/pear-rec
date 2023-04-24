import { app, screen, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import path from 'path';
import { getScreenSize, isDev } from './utils';
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

function createCutScreenWindow(): BrowserWindow {
  const { width, height } = getScreenSize();
  const cutScreenWindow = new BrowserWindow({
    width,
    height,
    autoHideMenuBar: true,
    useContentSize: true,
    movable: false,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    fullscreenable: true,
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  cutScreenWindow.webContents.openDevTools();

  if (isDev) {
    cutScreenWindow.loadURL("http://localhost:3000/main_window#/cut")
  } else {
    cutScreenWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: "cut"
    })
  }
  cutScreenWindow.maximize()
  cutScreenWindow.setFullScreen(true);

  return cutScreenWindow;
}

export { createCutScreenWindow };