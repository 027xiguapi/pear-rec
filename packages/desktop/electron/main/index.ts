import { app, BrowserWindow, shell, utilityProcess } from 'electron';
import { release } from 'node:os';
import * as mainWin from '../win/mainWin';
import { initTray } from './tray';
import { update } from './update';
import { registerFileProtocol } from './protocol';
import { registerGlobalShortcut, unregisterAllGlobalShortcut } from './globalShortcut';
import { initConfig, getConfig } from '@pear-rec/server/src/config';
import { initServerProcess, quitServerProcess } from './serverProcess';
import './ipcMain';

initServerProcess();
initConfig();

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ ├─┬ preload
// │ │ └── index.js    > Preload-Scripts
// │ └─┬ server
// │   └── index.js    > Server-Scripts
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
  mainWin.openMainWin();
}

app.whenReady().then(() => {
  const config = getConfig();
  registerFileProtocol();
  createWindow();
  initTray(config.language);
  registerGlobalShortcut();
  update();
});

app.on('will-quit', () => {
  quitServerProcess();
  unregisterAllGlobalShortcut();
});

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') app.quit();
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
