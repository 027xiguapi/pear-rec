import { BrowserWindow, dialog, shell, DownloadItem, WebContents } from 'electron';
import { join, dirname } from 'node:path';
import { ICON, preload, url, DIST, WEB_URL } from '../main/contract';
import { getImgsByImgUrl, readDirectoryImg } from '../main/utils';

const viewImageHtml = join(DIST, './viewImage.html');
let viewImageWin: BrowserWindow | null = null;

function createViewImageWin(search?: any): BrowserWindow {
  viewImageWin = new BrowserWindow({
    title: 'pear-rec 图片预览',
    icon: ICON,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const imgUrl = search?.imgUrl || '';

  if (url) {
    viewImageWin.loadURL(WEB_URL + `viewImage.html?imgUrl=${imgUrl}`);
    // Open devTool if the app is not packaged
    // viewImageWin.webContents.openDevTools();
  } else {
    viewImageWin.loadFile(viewImageHtml, {
      search: `?imgUrl=${imgUrl}`,
    });
  }

  viewImageWin.once('ready-to-show', async () => {
    viewImageWin?.show();
  });

  return viewImageWin;
}

function openViewImageWin(search?: any) {
  if (!viewImageWin || viewImageWin?.isDestroyed()) {
    viewImageWin = createViewImageWin(search);
  }
  viewImageWin.show();
}

function closeViewImageWin() {
  viewImageWin?.close();
  viewImageWin = null;
}

function destroyViewImageWin() {
  viewImageWin?.destroy();
  viewImageWin = null;
}

function hideViewImageWin() {
  viewImageWin?.hide();
}

function minimizeViewImageWin() {
  viewImageWin?.minimize();
}

function maximizeViewImageWin() {
  viewImageWin?.maximize();
}

function unmaximizeViewImageWin() {
  viewImageWin?.unmaximize();
}

function getIsAlwaysOnTopViewImageWin() {
  return viewImageWin?.isAlwaysOnTop();
}

function setIsAlwaysOnTopViewImageWin(isAlwaysOnTop: boolean) {
  viewImageWin?.setAlwaysOnTop(isAlwaysOnTop);
  return isAlwaysOnTop;
}

async function getImgs(imgUrl: any) {
  let imgs = await getImgsByImgUrl(imgUrl);
  return imgs;
}

export {
  createViewImageWin,
  openViewImageWin,
  closeViewImageWin,
  hideViewImageWin,
  minimizeViewImageWin,
  maximizeViewImageWin,
  unmaximizeViewImageWin,
  getIsAlwaysOnTopViewImageWin,
  setIsAlwaysOnTopViewImageWin,
  getImgs,
};
