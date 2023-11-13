import { BrowserWindow, dialog, shell, DownloadItem, WebContents } from 'electron';
import { join, dirname } from 'node:path';
import { ICON, DIST, preload, url, WEB_URL } from '../main/contract';

const editImageHtml = join(DIST, './clipScreen.html');
let editImageWin: BrowserWindow | null = null;

function createEditImageWin(search?: any): BrowserWindow {
  editImageWin = new BrowserWindow({
    title: 'pear-rec 图片编辑',
    icon: ICON,
    height: 768,
    width: 1024,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const imgUrl = search?.imgUrl || '';

  if (url) {
    editImageWin.loadURL(WEB_URL + `editImage.html?imgUrl=${imgUrl}`);
    // Open devTool if the app is not packaged
    editImageWin.webContents.openDevTools();
  } else {
    editImageWin.loadFile(editImageHtml, {
      hash: `?imgUrl=${imgUrl}`,
    });
  }

  editImageWin.once('ready-to-show', async () => {
    editImageWin?.show();
  });

  return editImageWin;
}

function openEditImageWin(search?: any) {
  if (!editImageWin || editImageWin?.isDestroyed()) {
    editImageWin = createEditImageWin(search);
  }
  editImageWin.show();
}

export { createEditImageWin, openEditImageWin };
