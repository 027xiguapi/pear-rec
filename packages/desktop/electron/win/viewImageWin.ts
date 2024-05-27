import { BrowserWindow, dialog } from 'electron';
import { readFile, writeFile } from 'node:fs';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';
import { getImgsByImgUrl } from '../main/utils';

// let viewImageWin: BrowserWindow | null = null;
let viewImageWinMap = new Map<number, BrowserWindow | null>();

function createViewImageWin(search?: any): BrowserWindow {
  let viewImageWin = new BrowserWindow({
    title: 'pear-rec 图片',
    icon: ICON,
    autoHideMenuBar: WIN_CONFIG.viewImage.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const imgUrl = search?.imgUrl || '';
  const recordId = search?.recordId || '';

  if (url) {
    viewImageWin.loadURL(
      WEB_URL +
        `viewImage.html?${imgUrl ? 'imgUrl=' + imgUrl : ''}${
          recordId ? 'recordId=' + recordId : ''
        }`,
    );
    // Open devTool if the app is not packaged
    // viewImageWin.webContents.openDevTools();
  } else {
    viewImageWin.loadFile(WIN_CONFIG.viewImage.html, {
      search: `?${imgUrl ? 'imgUrl=' + imgUrl : ''}${recordId ? 'recordId=' + recordId : ''}`,
    });
  }

  return viewImageWin;
}

function openViewImageWin(search?: any) {
  let viewImageWin = createViewImageWin(search);
  const winId = viewImageWin.webContents.id;
  viewImageWinMap.set(winId, viewImageWin);
  viewImageWin.show();
  return winId;
}

function closeViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  if (!(viewImageWin && viewImageWin.isDestroyed())) {
    viewImageWin?.close();
  }
  viewImageWin = null;
}

function destroyViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  viewImageWin?.destroy();
  viewImageWin = null;
}

function hideViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  viewImageWin?.hide();
}

function minimizeViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  viewImageWin?.minimize();
}

function maximizeViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  viewImageWin?.maximize();
}

function unmaximizeViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  viewImageWin?.unmaximize();
}

function getIsAlwaysOnTopViewImageWin(id) {
  let viewImageWin = viewImageWinMap.get(id);
  return viewImageWin?.isAlwaysOnTop();
}

function setIsAlwaysOnTopViewImageWin(id, isAlwaysOnTop) {
  let viewImageWin = viewImageWinMap.get(id);
  if (viewImageWin) {
    viewImageWin?.setAlwaysOnTop(isAlwaysOnTop);
  }

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
