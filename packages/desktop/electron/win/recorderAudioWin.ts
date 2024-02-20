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

function downloadURLRecorderAudioWin(downloadUrl: string) {
  // recorderAudioWin?.webContents.downloadURL(downloadUrl);
  // downloadSet.add(downloadUrl);
}

function setSizeRecorderAudioWin(width: number, height: number) {
  recorderAudioWin?.setResizable(true);
  recorderAudioWin?.setSize(width, height);
  recorderAudioWin?.setResizable(false);
}

export {
  closeRecorderAudioWin,
  createRecorderAudioWin,
  downloadURLRecorderAudioWin,
  hideRecorderAudioWin,
  minimizeRecorderAudioWin,
  openRecorderAudioWin,
  setSizeRecorderAudioWin,
};
