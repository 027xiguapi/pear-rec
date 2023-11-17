import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import * as mainWin from '../win/mainWin';
import { initTray } from './tray';
import './ipcMain';
import { registerFileProtocol } from './protocol';
import { registerGlobalShortcut, unregisterAllGlobalShortcut } from './globalShortcut';
import { initConfig } from './config';
import initApp from '@pear-rec/server/src';

initApp();
const config = initConfig();

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

async function createWindow() {
  mainWin.createMainWin();
}

app.whenReady().then(() => {
  registerFileProtocol();
  createWindow();
  initTray(config.language);
  registerGlobalShortcut();
});

app.on('will-quit', () => {
  unregisterAllGlobalShortcut();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  mainWin.focusMainWin();
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
