import { app, BrowserWindow, dialog, shell } from 'electron';
import { join, dirname } from 'node:path';
import { ICON, preload, url, DIST, WEB_URL } from '../main/constant';

const recorderAudioHtml = join(DIST, './recorderAudio.html');
let recorderAudioWin: BrowserWindow | null = null;

function createRecorderAudioWin(): BrowserWindow {
  recorderAudioWin = new BrowserWindow({
    title: 'pear-rec 录音',
    icon: ICON,
    width: 960, // 宽度(px), 默认值为 800
    height: 660, // 高度(px), 默认值为 600
    autoHideMenuBar: true, // 自动隐藏菜单栏
    // useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
    // movable: false, // 是否可移动
    // frame: false, // 无边框窗口
    // resizable: false, // 窗口大小是否可调整
    // hasShadow: false, // 窗口是否有阴影
    // transparent: true, // 使窗口透明
    // fullscreenable: false, // 窗口是否可以进入全屏状态
    // fullscreen: false, // 窗口是否全屏
    // simpleFullscreen: false, // 在 macOS 上使用 pre-Lion 全屏
    // alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    webPreferences: {
      preload,
    },
  });

  // recorderAudioWin.webContents.openDevTools();
  if (url) {
    recorderAudioWin.loadURL(WEB_URL + 'recorderAudio.html');
  } else {
    recorderAudioWin.loadFile(recorderAudioHtml);
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
  createRecorderAudioWin,
  closeRecorderAudioWin,
  openRecorderAudioWin,
  hideRecorderAudioWin,
  minimizeRecorderAudioWin,
  downloadURLRecorderAudioWin,
  setSizeRecorderAudioWin,
};
