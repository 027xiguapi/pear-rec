import { BrowserWindow, dialog, nativeImage } from 'electron';
import { writeFile } from 'node:fs';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';

let editImageWin: BrowserWindow | null = null;

function createEditImageWin(search?: any): BrowserWindow {
  editImageWin = new BrowserWindow({
    title: 'pear-rec 图片编辑',
    icon: ICON,
    height: WIN_CONFIG.editImage.height,
    width: WIN_CONFIG.editImage.width,
    autoHideMenuBar: WIN_CONFIG.editImage.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const imgUrl = search?.imgUrl || '';

  // editImageWin.webContents.openDevTools();
  if (url) {
    editImageWin.loadURL(WEB_URL + `editImage.html?imgUrl=${imgUrl}`);
  } else {
    editImageWin.loadFile(WIN_CONFIG.editImage.html, {
      search: `?imgUrl=${imgUrl}`,
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

function closeEditImageWin() {
  editImageWin?.close();
}

async function downloadImg(imgUrl: any) {
  let defaultPath = `pear-rec_${+new Date()}.png`;
  let res = await dialog.showSaveDialog({
    defaultPath: defaultPath,
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'gif'] }],
  });
  if (!res.canceled) {
    const imgData = nativeImage.createFromDataURL(imgUrl).toPNG();
    writeFile(res.filePath, imgData, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`${defaultPath}:图片保存成功`);
      }
    });
  }
}

export { closeEditImageWin, createEditImageWin, downloadImg, openEditImageWin };
