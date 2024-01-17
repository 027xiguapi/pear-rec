import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DIST, ICON, WEB_URL, preload, url } from '../main/contract';
import { getImgsByImgUrl } from '../main/utils';

const viewImageHtml = join(DIST, './viewImage.html');
let viewImageWin: BrowserWindow | null = null;

function createViewImageWin(search?: any): BrowserWindow {
  viewImageWin = new BrowserWindow({
    title: 'pear-rec 图片预览',
    icon: ICON,
    frame: false,
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

  return viewImageWin;
}

function openViewImageWin(search?: any) {
  if (!viewImageWin || viewImageWin?.isDestroyed()) {
    viewImageWin = createViewImageWin(search);
  }
  viewImageWin.show();
}

function closeViewImageWin() {
  if (!(viewImageWin && viewImageWin.isDestroyed())) {
    viewImageWin?.close();
  }
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
  closeViewImageWin,
  createViewImageWin,
  getImgs,
  getIsAlwaysOnTopViewImageWin,
  hideViewImageWin,
  maximizeViewImageWin,
  minimizeViewImageWin,
  openViewImageWin,
  setIsAlwaysOnTopViewImageWin,
  unmaximizeViewImageWin,
};
