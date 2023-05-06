import { BrowserWindow } from "electron";
import { getScreenSize, isDev } from "./utils";
import { join } from "node:path";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, "../public")
	: process.env.DIST;

const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

function createShotScreenWin(): BrowserWindow {
	const { width, height } = getScreenSize();
	const shotScreenWindow = new BrowserWindow({
		width, // 宽度(px), 默认值为 800
		height, // 高度(px), 默认值为 600
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
		alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	shotScreenWindow.webContents.openDevTools();
	// shotScreenWindow.setIgnoreMouseEvents(true);

	if (isDev) {
		shotScreenWindow.loadURL(url + "#/shotScreen");
	} else {
		shotScreenWindow.loadFile(indexHtml, {
			hash: "shotScreen",
		});
	}
	shotScreenWindow.maximize();
	shotScreenWindow.setFullScreen(true);

	return shotScreenWindow;
}

export { createShotScreenWin };
