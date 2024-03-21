import { BrowserWindow, app, shell } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let mainWin: BrowserWindow | null = null;

const createMainWin = (): BrowserWindow => {
  mainWin = new BrowserWindow({
    title: 'pear-rec',
    icon: ICON,
    width: WIN_CONFIG.main.width, // 宽度(px)
    height: WIN_CONFIG.main.height, // 高度(px)
    autoHideMenuBar: WIN_CONFIG.main.autoHideMenuBar, // 自动隐藏菜单栏
    maximizable: WIN_CONFIG.main.maximizable,
    resizable: WIN_CONFIG.main.resizable, // gnome下为false时无法全屏
    webPreferences: {
      preload,
    },
  });

  if (url) {
    mainWin.loadURL(WEB_URL + 'index.html');
  } else {
    mainWin.loadFile(WIN_CONFIG.main.html);
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
