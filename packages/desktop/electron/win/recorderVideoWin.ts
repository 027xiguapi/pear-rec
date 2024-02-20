import { BrowserWindow } from 'electron';
import { ICON, preload, url, WEB_URL, WIN_CONFIG } from '../main/constant';

let recorderVideoWin: BrowserWindow | null = null;
let downloadSet: Set<string> = new Set();

function createRecorderVideoWin(): BrowserWindow {
  recorderVideoWin = new BrowserWindow({
    title: 'pear-rec 录像',
    icon: ICON,
    height: WIN_CONFIG.recorderAudio.height,
    width: WIN_CONFIG.recorderAudio.width,
    autoHideMenuBar: WIN_CONFIG.recorderAudio.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  if (url) {
    recorderVideoWin.loadURL(WEB_URL + 'recorderVideo.html');
    // recorderVideoWin.webContents.openDevTools();
  } else {
    recorderVideoWin.loadFile(WIN_CONFIG.recorderAudio.html);
  }

  recorderVideoWin?.webContents.session.on(
    'will-download',
    async (event: any, item: any, webContents: any) => {
      const url = item.getURL();
      if (downloadSet.has(url)) {
        // const fileName = item.getFilename();
        // const filePath = (await getFilePath()) as string;
        // const rvFilePath = join(`${filePath}/rv`, `${fileName}`);
        // item.setSavePath(rvFilePath);
        // item.once('done', (event: any, state: any) => {
        //   if (state === 'completed') {
        //     setHistoryVideo(rvFilePath);
        //     setTimeout(() => {
        //       closeRecorderVideoWin();
        //       // shell.showItemInFolder(filePath);
        //     }, 1000);
        //   } else {
        //     dialog.showErrorBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
        //   }
        // });
      }
    },
  );

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

function downloadURLRecorderVideoWin(downloadUrl: string) {
  recorderVideoWin?.webContents.downloadURL(downloadUrl);
  downloadSet.add(downloadUrl);
}

export {
  closeRecorderVideoWin,
  createRecorderVideoWin,
  downloadURLRecorderVideoWin,
  openRecorderVideoWin,
};
