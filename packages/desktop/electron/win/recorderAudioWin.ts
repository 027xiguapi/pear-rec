import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let recorderAudioWin: BrowserWindow | null = null;

function createRecorderAudioWin(): BrowserWindow {
  recorderAudioWin = new BrowserWindow({
    title: 'pear-rec 录音',
    icon: ICON,
    width: WIN_CONFIG.recorderAudio.width, // 宽度(px), 默认值为 800
    height: WIN_CONFIG.recorderAudio.height, // 高度(px), 默认值为 600
    autoHideMenuBar: WIN_CONFIG.recorderAudio.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // recorderAudioWin.webContents.openDevTools();
  if (url) {
    recorderAudioWin.loadURL(WEB_URL + 'recorderAudio.html');
  } else {
    recorderAudioWin.loadFile(WIN_CONFIG.recorderAudio.html);
  }

  return recorderAudioWin;
}

// 打开关闭录屏窗口
function closeRecorderAudioWin() {
  recorderAudioWin?.isDestroyed() || recorderAudioWin?.close();
  recorderAudioWin = null;
}

function openRecorderAudioWin() {
  if (!recorderAudioWin || recorderAudioWin?.isDestroyed()) {
    recorderAudioWin = createRecorderAudioWin();
  }
  recorderAudioWin?.show();
}

function hideRecorderAudioWin() {
  recorderAudioWin?.hide();
}

function minimizeRecorderAudioWin() {
  recorderAudioWin?.minimize();
}

function setSizeRecorderAudioWin(width: number, height: number) {
  recorderAudioWin?.setResizable(true);
  recorderAudioWin?.setSize(width, height);
  recorderAudioWin?.setResizable(false);
}

async function downloadAudio(audioUrl: any) {
  recorderAudioWin.webContents.downloadURL(audioUrl);
  recorderAudioWin.webContents.session.once('will-download', async (event, item, webContents) => {
    item.setSaveDialogOptions({});
    item.once('done', (event, state) => {
      if (state === 'completed') {
        const savePath = item.getSavePath();
        const fileName = item.getFilename();
        recorderAudioWin.webContents.send('ra:send-file', {
          fileName: fileName,
          filePath: savePath,
        });
        console.log(`${savePath}:录音保存成功`);
      }
    });
  });
}

export {
  closeRecorderAudioWin,
  createRecorderAudioWin,
  hideRecorderAudioWin,
  minimizeRecorderAudioWin,
  openRecorderAudioWin,
  setSizeRecorderAudioWin,
  downloadAudio,
};
