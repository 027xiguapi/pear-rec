import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let editVideoWin: BrowserWindow | null = null;

function createEditVideoWin(): BrowserWindow {
  editVideoWin = new BrowserWindow({
    title: 'pear-rec',
    icon: ICON,
    height: WIN_CONFIG.editVideo.height,
    width: WIN_CONFIG.editVideo.width,
    autoHideMenuBar: WIN_CONFIG.editVideo.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  editVideoWin.webContents.openDevTools();
  if (url) {
    editVideoWin.loadURL(WEB_URL + 'editVideo.html');
  } else {
    editVideoWin.loadFile(WIN_CONFIG.editVideo.html);
  }

  return editVideoWin;
}

// 打开关闭录屏窗口
function closeEditVideoWin() {
  editVideoWin?.isDestroyed() || editVideoWin?.close();
  editVideoWin = null;
}

function openEditVideoWin() {
  if (!editVideoWin || editVideoWin?.isDestroyed()) {
    editVideoWin = createEditVideoWin();
  }
  editVideoWin?.show();
}

function downloadVideo(file) {
  editVideoWin.webContents.downloadURL(file.url);
  editVideoWin.webContents.session.once('will-download', async (event, item, webContents) => {
    item.setSaveDialogOptions({
      defaultPath: file.fileName,
    });
    item.once('done', (event, state) => {
      if (state === 'completed') {
        const savePath = item.getSavePath();
        const fileName = item.getFilename();
        editVideoWin.webContents.send('rv:send-file', {
          fileName: fileName,
          filePath: savePath,
        });
        console.log(`${savePath}:录像保存成功`);
      }
    });
  });
}

export { closeEditVideoWin, createEditVideoWin, downloadVideo, openEditVideoWin };
