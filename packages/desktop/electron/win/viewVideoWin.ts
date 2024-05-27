import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';
import { getVideosByVideoUrl } from '../main/utils';

let viewVideoWin: BrowserWindow | null = null;

function createViewVideoWin(search?: any): BrowserWindow {
  viewVideoWin = new BrowserWindow({
    title: 'pear-rec 视频',
    icon: ICON,
    autoHideMenuBar: WIN_CONFIG.viewVideo.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const videoUrl = search?.videoUrl || '';
  const recordId = search?.recordId || '';

  if (url) {
    viewVideoWin.loadURL(
      WEB_URL +
        `viewVideo.html?${videoUrl ? 'videoUrl=' + videoUrl : ''}${
          recordId ? 'recordId=' + recordId : ''
        }`,
    );
    // Open devTool if the app is not packaged
    // viewVideoWin.webContents.openDevTools();
  } else {
    viewVideoWin.loadFile(WIN_CONFIG.viewVideo.html, {
      search: `?${videoUrl ? 'videoUrl=' + videoUrl : ''}${recordId ? 'recordId=' + recordId : ''}`,
    });
  }

  viewVideoWin.once('ready-to-show', async () => {
    viewVideoWin?.show();
  });

  return viewVideoWin;
}

function openViewVideoWin(search?: any) {
  viewVideoWin = createViewVideoWin(search);
  viewVideoWin.show();
}

function closeViewVideoWin() {
  if (!(viewVideoWin && viewVideoWin.isDestroyed())) {
    viewVideoWin?.close();
  }
  viewVideoWin = null;
}

function hideViewVideoWin() {
  viewVideoWin?.hide();
}

function minimizeViewVideoWin() {
  viewVideoWin?.minimize();
}

function maximizeViewVideoWin() {
  viewVideoWin?.maximize();
}

function unmaximizeViewVideoWin() {
  viewVideoWin?.unmaximize();
}

function setAlwaysOnTopViewVideoWin(isAlwaysOnTop: boolean) {
  viewVideoWin?.setAlwaysOnTop(isAlwaysOnTop);
}

async function getVideos(videoUrl: string) {
  const res = await getVideosByVideoUrl(videoUrl);
  return res;
}

async function sendHistoryVideo() {
  // const filePath = await getHistoryVideoPath();
  // let video = await readDirectoryVideo(filePath);
  // return video;
}

export {
  closeViewVideoWin,
  createViewVideoWin,
  hideViewVideoWin,
  maximizeViewVideoWin,
  minimizeViewVideoWin,
  openViewVideoWin,
  sendHistoryVideo,
  setAlwaysOnTopViewVideoWin,
  unmaximizeViewVideoWin,
  getVideos,
};
