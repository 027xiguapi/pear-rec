import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let recorderVideoWin: BrowserWindow | null = null;

function createRecorderVideoWin(): BrowserWindow {
  recorderVideoWin = new BrowserWindow({
    title: 'pear-rec 录像',
    icon: ICON,
    height: WIN_CONFIG.recorderVideo.height,
    width: WIN_CONFIG.recorderVideo.width,
    autoHideMenuBar: WIN_CONFIG.recorderVideo.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // recorderVideoWin.webContents.openDevTools();
  if (url) {
    recorderVideoWin.loadURL(WEB_URL + 'recorderVideo.html');
  } else {
    recorderVideoWin.loadFile(WIN_CONFIG.recorderVideo.html);
  }

  return recorderVideoWin;
}

// 打开关闭录屏窗口
function closeRecorderVideoWin() {
  recorderVideoWin?.isDestroyed() || recorderVideoWin?.close();
  recorderVideoWin = null;
}

function openRecorderVideoWin() {
  if (!recorderVideoWin || recorderVideoWin?.isDestroyed()) {
    recorderVideoWin = createRecorderVideoWin();
  }
  recorderVideoWin?.show();
}

function downloadVideo(file) {
  recorderVideoWin.webContents.downloadURL(file.url);
  recorderVideoWin.webContents.session.once('will-download', async (event, item, webContents) => {
    item.setSaveDialogOptions({
      defaultPath: file.fileName,
    });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        const savePath = item.getSavePath();
        const fileName = item.getFilename();
        recorderVideoWin.webContents.send('rv:send-file', {
          fileName: fileName,
          filePath: savePath,
        });
        console.log(`${savePath}:录像保存成功`);
      }
    });
  });
}

export { closeRecorderVideoWin, createRecorderVideoWin, downloadVideo, openRecorderVideoWin };
