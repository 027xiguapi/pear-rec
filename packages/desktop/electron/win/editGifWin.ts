import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { ICON, DIST, preload, url, WEB_URL } from '../main/contract';

const editGifHtml = join(DIST, './editGif.html');
let editGifWin: BrowserWindow | null = null;

function createEditGifWin(search?: any): BrowserWindow {
  editGifWin = new BrowserWindow({
    title: 'pear-rec 动图编辑',
    icon: ICON,
    height: 768,
    width: 1024,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  // const videoUrl = search?.videoUrl || '';
  const filePath = search?.filePath || '';

  // editGifWin.webContents.openDevTools();
  if (url) {
    editGifWin.loadURL(WEB_URL + `editGif.html?filePath=${filePath}`);
  } else {
    editGifWin.loadFile(editGifHtml, {
      search: `?filePath=${filePath}`,
    });
  }

  return editGifWin;
}

function openEditGifWin(search?: any) {
  if (!editGifWin || editGifWin?.isDestroyed()) {
    editGifWin = createEditGifWin(search);
  }
  editGifWin.show();
}

function closeEditGifWin() {
  editGifWin?.close();
}

export { createEditGifWin, openEditGifWin, closeEditGifWin };
