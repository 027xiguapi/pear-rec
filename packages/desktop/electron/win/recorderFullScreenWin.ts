import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let recorderFullScreenWin: BrowserWindow | null = null;

function createRecorderFullScreenWin(): BrowserWindow {
  recorderFullScreenWin = new BrowserWindow({
    title: 'pear-rec 录屏',
    icon: ICON,
    height: WIN_CONFIG.recorderFullScreen.height,
    width: WIN_CONFIG.recorderFullScreen.width,
    center: WIN_CONFIG.recorderFullScreen.center,
    transparent: WIN_CONFIG.recorderFullScreen.transparent, // 使窗口透明
    autoHideMenuBar: WIN_CONFIG.recorderFullScreen.autoHideMenuBar, // 自动隐藏菜单栏
    frame: WIN_CONFIG.recorderFullScreen.frame, // 无边框窗口
    hasShadow: WIN_CONFIG.recorderFullScreen.hasShadow, // 窗口是否有阴影
    fullscreenable: WIN_CONFIG.recorderFullScreen.fullscreenable, // 窗口是否可以进入全屏状态
    alwaysOnTop: WIN_CONFIG.recorderFullScreen.alwaysOnTop, // 窗口是否永远在别的窗口的上面
    skipTaskbar: WIN_CONFIG.recorderFullScreen.skipTaskbar,
    resizable: WIN_CONFIG.recorderFullScreen.resizable,
    webPreferences: {
      preload,
    },
  });
  recorderFullScreenWin?.setBounds({ y: 0 });
  if (url) {
    recorderFullScreenWin.loadURL(WEB_URL + `recorderFullScreen.html`);
  } else {
    recorderFullScreenWin.loadFile(WIN_CONFIG.recorderFullScreen.html);
  }
  // recorderFullScreenWin.webContents.openDevTools();

  return recorderFullScreenWin;
}

function closeRecorderFullScreenWin() {
  recorderFullScreenWin?.isDestroyed() || recorderFullScreenWin?.close();
  recorderFullScreenWin = null;
}

function openRecorderFullScreenWin() {
  if (!recorderFullScreenWin || recorderFullScreenWin?.isDestroyed()) {
    recorderFullScreenWin = createRecorderFullScreenWin();
  }
  recorderFullScreenWin?.show();
}

function hideRecorderFullScreenWin() {
  recorderFullScreenWin?.hide();
}

function showRecorderFullScreenWin() {
  recorderFullScreenWin?.show();
}

function minimizeRecorderFullScreenWin() {
  recorderFullScreenWin?.minimize();
}

function setMovableRecorderFullScreenWin(movable: boolean) {
  recorderFullScreenWin?.setMovable(movable);
}

function setAlwaysOnTopRecorderFullScreenWin(isAlwaysOnTop: boolean) {
  recorderFullScreenWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function downloadVideo(file) {
  recorderFullScreenWin.webContents.downloadURL(file.url);
  recorderFullScreenWin.webContents.session.once(
    'will-download',
    async (event, item, webContents) => {
      item.setSaveDialogOptions({
        defaultPath: file.fileName,
      });
      item.once('done', (event, state) => {
        if (state === 'completed') {
          const savePath = item.getSavePath();
          const fileName = item.getFilename();
          recorderFullScreenWin.webContents.send('rfs:send-file', {
            fileName: fileName,
            filePath: savePath,
          });
          console.log(`${savePath}:录像保存成功`);
        }
      });
    },
  );
}

export {
  closeRecorderFullScreenWin,
  createRecorderFullScreenWin,
  hideRecorderFullScreenWin,
  minimizeRecorderFullScreenWin,
  openRecorderFullScreenWin,
  setAlwaysOnTopRecorderFullScreenWin,
  setMovableRecorderFullScreenWin,
  showRecorderFullScreenWin,
  downloadVideo,
};
