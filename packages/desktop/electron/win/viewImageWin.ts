import { BrowserWindow, dialog } from 'electron';
import { readFile, writeFile } from 'node:fs';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';
import { getImgsByImgUrl } from '../main/utils';

let viewImageWin: BrowserWindow | null = null;

function createViewImageWin(search?: any): BrowserWindow {
  viewImageWin = new BrowserWindow({
    title: 'pear-rec 图片',
    icon: ICON,
    frame: WIN_CONFIG.viewImage.frame,
    autoHideMenuBar: WIN_CONFIG.viewImage.autoHideMenuBar, // 自动隐藏菜单栏
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
    viewImageWin.loadFile(WIN_CONFIG.viewImage.html, {
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

async function downloadImg(imgUrl: any) {
  let defaultPath = `pear-rec_${+new Date()}.png`;
  let res = await dialog.showSaveDialog({
    defaultPath: defaultPath,
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'gif'] }],
  });
  if (!res.canceled) {
    readFile(imgUrl, (err, imgData) => {
      if (err) {
        console.error(err);
      } else {
        writeFile(res.filePath, imgData, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`${defaultPath}:图片保存成功`);
          }
        });
      }
    });
  }
  return imgUrl;
}

export {
  closeViewImageWin,
  createViewImageWin,
  downloadImg,
  getImgs,
  getIsAlwaysOnTopViewImageWin,
  hideViewImageWin,
  maximizeViewImageWin,
  minimizeViewImageWin,
  openViewImageWin,
  setIsAlwaysOnTopViewImageWin,
  unmaximizeViewImageWin,
};
