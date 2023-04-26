import { BrowserWindow } from 'electron';
import path from 'path';
import { getScreenSize, isDev } from './utils';
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

function createShotScreenWindow(): BrowserWindow {
  const { width, height } = getScreenSize();
  const shotScreenWindow = new BrowserWindow({
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
      sandbox: false,
    }
  });

  // shotScreenWindow.webContents.openDevTools();

  if (isDev) {
    shotScreenWindow.loadURL("http://localhost:3000/main_window#/shotScreen")
  } else {
    shotScreenWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: "shotScreen"
    })
  }
  shotScreenWindow.maximize()
  shotScreenWindow.setFullScreen(true);

  return shotScreenWindow;
}

export { createShotScreenWindow };