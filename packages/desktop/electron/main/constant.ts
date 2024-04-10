import { homedir } from 'node:os';
import path from 'node:path';

process.env.DIST_ELECTRON = path.join(__dirname, '../');
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist');

export const isMac = process.platform === 'darwin';
export const isLinux = process.platform == 'linux';
export const isWin = process.platform == 'win32';

export const url = import.meta.env.VITE_DEV_SERVER_URL;
export const WEB_URL = import.meta.env.VITE_WEB_URL;
export const VITE_API_URL = import.meta.env.VITE_API_URL;

export const preload = path.join(__dirname, '../preload/index.js');
export const serverPath = path.join(__dirname, '../server/main.js');
export const DIST_ELECTRON = path.join(__dirname, '../');
export const DIST = path.join(DIST_ELECTRON, '../dist');

export const PUBLIC = url ? path.join(DIST_ELECTRON, '../public') : process.env.DIST;

export const ICON = path.join(PUBLIC, './imgs/icons/png/32x32.png');
export const ICONx2 = path.join(PUBLIC, './imgs/icons/png/64x64.png');

export const DOCS_PATH = path.join(homedir(), 'Documents');

export const PEAR_FILES_PATH = path.join(DOCS_PATH, 'Pear Files');

export const CONFIG_FILE_PATH = path.join(PEAR_FILES_PATH, `config.json`);

export const DEFAULT_CONFIG_FILE_PATH = path.join(PEAR_FILES_PATH, `default-config.json`);

export const DB_PATH = path.join(PEAR_FILES_PATH, 'db/pear-rec.db');

export const LOG_PATH = path.join(PEAR_FILES_PATH, 'log');

export const WIN_CONFIG = {
  main: {
    html: path.join(process.env.DIST, 'index.html'),
    width: 660,
    height: 410,
    autoHideMenuBar: true,
    maximizable: false,
    resizable: false,
  },
  canvas: {
    html: path.join(process.env.DIST, 'canvas.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
  },
  clipScreen: {
    html: path.join(process.env.DIST, 'clipScreen.html'),
    autoHideMenuBar: true,
    frame: false, // 无边框窗口
    resizable: true, // 窗口大小是否可调整
    transparent: true, // 使窗口透明
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true,
    skipTaskbar: true,
  },
  editGif: {
    html: path.join(process.env.DIST, 'editGif.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
  },
  editImage: {
    html: path.join(process.env.DIST, 'editImage.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
  },
  videoConverter: {
    html: path.join(process.env.DIST, 'videoConverter.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
  },
  pinImage: {
    html: path.join(process.env.DIST, 'pinImage.html'),
    frame: false, // 无边框窗口
    transparent: true, // 使窗口透明
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    autoHideMenuBar: true,
  },
  pinVideo: {
    html: path.join(process.env.DIST, 'pinVideo.html'),
    height: 450,
    width: 600,
    frame: false, // 无边框窗口
    resizable: true, // 窗口大小是否可调整
    transparent: true, // 使窗口透明
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    autoHideMenuBar: true, // 自动隐藏菜单栏
  },
  recorderAudio: {
    html: path.join(process.env.DIST, 'recorderAudio.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true, // 自动隐藏菜单栏
  },
  recorderFullScreen: {
    html: path.join(process.env.DIST, 'recorderFullScreen.html'),
    height: 40,
    width: 365,
    center: true,
    transparent: true, // 使窗口透明
    autoHideMenuBar: true, // 自动隐藏菜单栏
    frame: false, // 无边框窗口
    hasShadow: false, // 窗口是否有阴影
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    skipTaskbar: true,
    resizable: false,
  },
  recorderScreen: {
    html: path.join(process.env.DIST, 'recorderScreen.html'),
    width: 340,
    height: 130,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    maximizable: false, // 最大
    hasShadow: false, // 窗口是否有阴影
    fullscreenable: false, // 窗口是否可以进入全屏状态
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    skipTaskbar: true,
    resizable: false,
  },
  recorderVideo: {
    html: path.join(process.env.DIST, 'recorderVideo.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
  },
  records: {
    html: path.join(process.env.DIST, 'records.html'),
    width: 1024,
    autoHideMenuBar: true,
  },
  setting: {
    html: path.join(process.env.DIST, 'setting.html'),
    autoHideMenuBar: true,
    width: 600,
    height: 380,
  },
  shotScreen: {
    html: path.join(process.env.DIST, 'shotScreen.html'),
    autoHideMenuBar: true, // 自动隐藏菜单栏
    useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
    movable: false, // 是否可移动
    frame: false, // 无边框窗口
    resizable: false, // 窗口大小是否可调整
    hasShadow: false, // 窗口是否有阴影
    transparent: true, // 使窗口透明
    fullscreenable: true, // 窗口是否可以进入全屏状态
    fullscreen: true, // 窗口是否全屏
    simpleFullscreen: true, // 在 macOS 上使用 pre-Lion 全屏
    alwaysOnTop: true,
    skipTaskbar: true,
  },
  spliceImage: {
    html: path.join(process.env.DIST, 'spliceImage.html'),
    height: 768,
    width: 1024,
    autoHideMenuBar: true,
  },
  viewAudio: {
    html: path.join(process.env.DIST, 'viewAudio.html'),
    autoHideMenuBar: true,
  },
  viewImage: {
    html: path.join(process.env.DIST, 'viewImage.html'),
    frame: false,
    autoHideMenuBar: true,
  },
  viewVideo: {
    html: path.join(process.env.DIST, 'viewVideo.html'),
    autoHideMenuBar: true,
  },
};
