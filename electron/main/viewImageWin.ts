import { BrowserWindow } from "electron";
import { join, dirname } from "node:path";
import {
	PUBLIC,
	readDirectory,
	readDirectoryImg,
	preload,
	url,
	indexHtml,
} from "./utils";
import { getHistoryImg, getFilePath } from "./store";

let viewImageWin: BrowserWindow | null = null;
let historyImgPath: string = "";

function createViewImageWin(isHistory?: boolean): BrowserWindow {
	viewImageWin = new BrowserWindow({
		title: "pear-rec 图片预览",
		icon: join(PUBLIC, "logo@2x.ico"),
		width: 800, // 宽度(px), 默认值为 800
		height: 600, // 高度(px), 默认值为 600
		minHeight: 400,
		minWidth: 400,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		// useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
		// movable: true, // 是否可移动
		frame: true, // 有无边框窗口
		// resizable: false, // 窗口大小是否可调整
		// hasShadow: false, // 窗口是否有阴影
		// transparent: true, // 使窗口透明
		// fullscreenable: true, // 窗口是否可以进入全屏状态
		// fullscreen: true, // 窗口是否全屏
		// simpleFullscreen: true, // 在 macOS 上使用 pre-Lion 全屏
		// alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
		modal: true,
		titleBarStyle: "hidden",
		titleBarOverlay: true,
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (url) {
		// electron-vite-vue#298
		viewImageWin.loadURL(url + `#/viewImage?${isHistory ? "history=1" : ""}`);
		// Open devTool if the app is not packaged
		// viewImageWin.webContents.openDevTools();
	} else {
		viewImageWin.loadFile(indexHtml, {
			hash: `viewImage?${isHistory ? "history=1" : ""}`,
		});
	}

	viewImageWin.once("ready-to-show", async () => {
		viewImageWin?.show();
	});

	return viewImageWin;
}

function openViewImageWin(isHistory?: boolean) {
	if (!viewImageWin || viewImageWin?.isDestroyed()) {
		viewImageWin = createViewImageWin(isHistory);
	}
	viewImageWin.show();
}

function closeViewImageWin() {
	viewImageWin?.close();
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

function setAlwaysOnTopViewImageWin(isAlwaysOnTop: boolean) {
	viewImageWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function getHistoryImgPath() {
	const historyImgPath = (getHistoryImg() as string) || "";
	return historyImgPath;
}

async function sendHistoryImg() {
	const filePath = getHistoryImgPath();
	let img = await readDirectoryImg(filePath);
	return img;
}

function getSsImgPath() {
	const filePath = getFilePath() as string;
	const ssFilePath = `${filePath}/ss`;
	return ssFilePath;
}

async function getSsImgs() {
	const ssFilePath = getSsImgPath();
	let imgs = await readDirectory(ssFilePath);
	return imgs;
}

export {
	createViewImageWin,
	openViewImageWin,
	closeViewImageWin,
	hideViewImageWin,
	minimizeViewImageWin,
	maximizeViewImageWin,
	unmaximizeViewImageWin,
	setAlwaysOnTopViewImageWin,
	sendHistoryImg,
	getSsImgs,
};
