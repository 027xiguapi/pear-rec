import { BrowserWindow, dialog, nativeImage } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let videoConverterWin: BrowserWindow | null = null;

function createVideoConverterWin(search?: any): BrowserWindow {
  videoConverterWin = new BrowserWindow({
    title: 'pear-rec 图片编辑',
    icon: ICON,
    height: WIN_CONFIG.videoConverter.height,
    width: WIN_CONFIG.videoConverter.width,
    autoHideMenuBar: WIN_CONFIG.videoConverter.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const videoUrl = search?.videoUrl || '';

  videoConverterWin.webContents.openDevTools();
  if (url) {
    videoConverterWin.loadURL(WEB_URL + `videoConverter.html?videoUrl=${videoUrl}`);
  } else {
    videoConverterWin.loadFile(WIN_CONFIG.videoConverter.html, {
      search: `?videoUrl=${videoUrl}`,
    });
  }

  videoConverterWin.once('ready-to-show', async () => {
    videoConverterWin?.show();
  });

  return videoConverterWin;
}

function openVideoConverterWin(search?: any) {
  if (!videoConverterWin || videoConverterWin?.isDestroyed()) {
    videoConverterWin = createVideoConverterWin(search);
  }
  videoConverterWin.show();
}

function closeVideoConverterWin() {
  videoConverterWin?.close();
}

export { closeVideoConverterWin, createVideoConverterWin, openVideoConverterWin };
