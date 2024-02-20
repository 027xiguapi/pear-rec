import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let editGifWin: BrowserWindow | null = null;

function createEditGifWin(search?: any): BrowserWindow {
  editGifWin = new BrowserWindow({
    title: 'pear-rec 动图编辑',
    icon: ICON,
    height: WIN_CONFIG.editGif.height,
    width: WIN_CONFIG.editGif.width,
    autoHideMenuBar: WIN_CONFIG.editGif.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const videoUrl = search?.videoUrl || '';
  const filePath = search?.filePath || '';
  const imgUrl = search?.imgUrl || '';

  // editGifWin.webContents.openDevTools();
  if (url) {
    editGifWin.loadURL(
      WEB_URL +
        `editGif.html?${filePath ? 'filePath=' + filePath : ''}${imgUrl ? 'imgUrl=' + imgUrl : ''}${
          videoUrl ? 'videoUrl=' + videoUrl : ''
        }`,
    );
  } else {
    editGifWin.loadFile(WIN_CONFIG.editGif.html, {
      search: `?${filePath ? 'filePath=' + filePath : ''}${imgUrl ? 'imgUrl=' + imgUrl : ''}${
        videoUrl ? 'videoUrl=' + videoUrl : ''
      }`,
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

export { closeEditGifWin, createEditGifWin, openEditGifWin };
