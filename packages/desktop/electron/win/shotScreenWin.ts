import { BrowserWindow, clipboard, dialog, nativeImage, screen, desktopCapturer } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, PEAR_FILES_PATH, preload, url } from '../main/constant';
import { writeFile, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import * as utils from '../main/utils';

let shotScreenWin: BrowserWindow | null = null;

function createShotScreenWin(): BrowserWindow {
  shotScreenWin = new BrowserWindow({
    title: 'pear-rec 截图',
    icon: ICON,
    show: false,
    autoHideMenuBar: WIN_CONFIG.shotScreen.autoHideMenuBar, // 自动隐藏菜单栏
    useContentSize: WIN_CONFIG.shotScreen.useContentSize, // width 和 height 将设置为 web 页面的尺寸
    movable: WIN_CONFIG.shotScreen.movable, // 是否可移动
    frame: WIN_CONFIG.shotScreen.frame, // 无边框窗口
    resizable: WIN_CONFIG.shotScreen.resizable, // 窗口大小是否可调整
    hasShadow: WIN_CONFIG.shotScreen.hasShadow, // 窗口是否有阴影
    transparent: WIN_CONFIG.shotScreen.transparent, // 使窗口透明
    fullscreenable: WIN_CONFIG.shotScreen.fullscreenable, // 窗口是否可以进入全屏状态
    fullscreen: WIN_CONFIG.shotScreen.fullscreen, // 窗口是否全屏
    simpleFullscreen: WIN_CONFIG.shotScreen.simpleFullscreen, // 在 macOS 上使用 pre-Lion 全屏
    alwaysOnTop: WIN_CONFIG.shotScreen.alwaysOnTop,
    skipTaskbar: WIN_CONFIG.shotScreen.skipTaskbar,
    webPreferences: {
      preload,
    },
  });

  // shotScreenWin.webContents.openDevTools();

  if (url) {
    shotScreenWin.loadURL(WEB_URL + 'shotScreen.html');
  } else {
    shotScreenWin.loadFile(WIN_CONFIG.shotScreen.html);
  }
  shotScreenWin.maximize();
  shotScreenWin.setFullScreen(true);

  return shotScreenWin;
}

// 打开关闭录屏窗口
function closeShotScreenWin() {
  shotScreenWin?.isDestroyed() || shotScreenWin?.close();
  shotScreenWin = null;
}

function openShotScreenWin() {
  if (!shotScreenWin || shotScreenWin?.isDestroyed()) {
    shotScreenWin = createShotScreenWin();
  }
  // shotScreenWin?.show();
}

async function showShotScreenWin() {
  const { id } = screen.getPrimaryDisplay();
  const { width, height } = utils.getScreenSize();
  const sources = [
    ...(await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width,
        height,
      },
    })),
  ];

  let source = sources.filter((e: any) => parseInt(e.display_id, 10) == id)[0];
  source || (source = sources[0]);
  const img = source.thumbnail.toDataURL();
  shotScreenWin?.webContents.send('ss:show-win', img);
  if (!shotScreenWin || shotScreenWin?.isDestroyed()) {
    shotScreenWin = createShotScreenWin();
  }
  shotScreenWin?.show();
}

function hideShotScreenWin() {
  shotScreenWin?.webContents.send('ss:hide-win');
  shotScreenWin?.hide();
}

function minimizeShotScreenWin() {
  shotScreenWin?.minimize();
}

function maximizeShotScreenWin() {
  shotScreenWin?.maximize();
}

function unmaximizeShotScreenWin() {
  shotScreenWin?.unmaximize();
}

async function downloadImg(file: any) {
  let defaultPath = file.fileName;
  let isPin = file.isPin;
  let isShow = file.isShow;
  let res =
    isShow &&
    (await dialog.showSaveDialog({
      defaultPath: defaultPath,
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'gif'] }],
    }));
  if (!res.canceled || isPin) {
    const imagePath = isShow ? res.filePath : path.join(PEAR_FILES_PATH, `/ss/${defaultPath}`);
    const directory = path.dirname(imagePath);
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
    const imgData = nativeImage.createFromDataURL(file.fileData).toPNG();
    writeFile(imagePath, imgData, (err) => {
      if (err) {
        console.error(err);
      } else {
        shotScreenWin.webContents.send('ss:send-file', {
          fileName: defaultPath,
          filePath: imagePath,
          bounds: file.bounds,
          isShow: isShow,
          isPin: isPin,
        });
        console.log(`${imagePath}:图片保存成功`);
      }
    });
  }
}

function copyImg(filePath: string) {
  const data = Buffer.from(`file://${encodeURI(filePath)}`, 'utf-8');
  clipboard.writeBuffer('image/png', data);
}

export {
  closeShotScreenWin,
  copyImg,
  createShotScreenWin,
  downloadImg,
  hideShotScreenWin,
  maximizeShotScreenWin,
  minimizeShotScreenWin,
  openShotScreenWin,
  showShotScreenWin,
  unmaximizeShotScreenWin,
};
