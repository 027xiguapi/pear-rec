import { BrowserWindow, app, shell } from 'electron';
import { join } from 'node:path';
import { ICON, WEB_URL, preload, url } from '../main/constant';

const indexHtml = join(process.env.DIST, 'index.html');
let mainWin: BrowserWindow | null = null;

const createMainWin = (): BrowserWindow => {
  mainWin = new BrowserWindow({
    title: 'pear-rec',
    icon: ICON,
    width: 660, // 宽度(px)
    height: 375, // 高度(px)
    // maxWidth: 660,
    // maxHeight: 375,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    maximizable: false,
    // closable: false,
    // frame: false,
    // show: false,
    // alwaysOnTop: !dev, // 为了方便调试，调试模式就不居上了
    // fullscreenable: true,
    // transparent: true,
    resizable: false, // gnome下为false时无法全屏
    // skipTaskbar: true,
    // movable: false,
    // enableLargerThanScreen: true, // mac
    // hasShadow: false,
    webPreferences: {
      preload,
    },
  });

  if (url) {
    mainWin.loadURL(WEB_URL + 'index.html');
  } else {
    mainWin.loadFile(indexHtml);
  }
  // mainWin.webContents.openDevTools();

  // Test actively push message to the Electron-Renderer
  // mainWin.webContents.on("did-finish-load", () => {
  // 	mainWin?.webContents.send(
  // 		"main-process-message",
  // 		new Date().toLocaleString(),
  // 	);
  // });

  // Make all links open with the browser, not with the application
  mainWin.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // mainWin.onbeforeunload = (e) => {
  //   console.log('I do not want to be closed');

  //   // 与通常的浏览器不同,会提示给用户一个消息框,
  //   //返回非空值将默认取消关闭
  //   //建议使用对话框 API 让用户确认关闭应用程序.
  //   e.returnValue = false;
  // };

  // window.addEventListener('beforeunload', (e) => {
  //   e.returnValue = false;
  // });

  return mainWin;
};

function closeMainWin() {
  if (mainWin && !mainWin?.isDestroyed()) {
    mainWin?.close();
  }
  mainWin = null;
}

function openMainWin() {
  if (!mainWin || mainWin?.isDestroyed()) {
    mainWin = createMainWin();
  }
  mainWin?.show();
}

function hideMainWin() {
  mainWin!.hide();
}

function minimizeMainWin() {
  mainWin!.minimize();
}

function focusMainWin() {
  if (!mainWin || mainWin?.isDestroyed()) {
    mainWin = createMainWin();
  } else {
    // Focus on the main window if the user tried to open another
    if (mainWin.isMinimized()) mainWin.restore();
    if (!mainWin.isVisible()) mainWin.show();
    mainWin.focus();
  }
}

function sendEuUpdateCanAvailable(arg, update) {
  if (mainWin && !mainWin?.isDestroyed()) {
    mainWin.webContents.send('eu:update-can-available', {
      update: update,
      version: app.getVersion(),
      newVersion: arg?.version,
    });
  }
}

export {
  closeMainWin,
  createMainWin,
  focusMainWin,
  hideMainWin,
  minimizeMainWin,
  openMainWin,
  sendEuUpdateCanAvailable,
};
