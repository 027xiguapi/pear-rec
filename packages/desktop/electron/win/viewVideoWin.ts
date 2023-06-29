import { BrowserWindow } from "electron";
import { join } from "node:path";
import {
	PUBLIC,
	readDirectoryVideo,
	preload,
	url,
	indexHtml,
} from "../main/utils";
import { getHistoryVideo } from "../main/store";

let viewVideoWin: BrowserWindow | null = null;

function createViewVideoWin(search?: any): BrowserWindow {
	viewVideoWin = new BrowserWindow({
		title: "pear-rec 视频预览",
		icon: join(PUBLIC, "/imgs/logo/logo@2x.ico"),
		width: 800, // 宽度(px), 默认值为 800
		height: 600, // 高度(px), 默认值为 600
		minHeight: 400,
		minWidth: 400,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		// useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
		// movable: true, // 是否可移动
		// frame: true, // 有无边框窗口
		// resizable: false, // 窗口大小是否可调整
		// hasShadow: false, // 窗口是否有阴影
		// transparent: true, // 使窗口透明
		// fullscreenable: true, // 窗口是否可以进入全屏状态
		// fullscreen: true, // 窗口是否全屏
		// simpleFullscreen: true, // 在 macOS 上使用 pre-Lion 全屏
		// alwaysOnTop: false, // 窗口是否永远在别的窗口的上面
		// modal: true,
		// titleBarStyle: "hidden",
		// titleBarOverlay: true,
		webPreferences: {
			preload,
		},
	});

	if (url) {
		console.log(search?.url);
		// electron-vite-vue#298
		viewVideoWin.loadURL(url + `#/viewVideo?url=${search?.url || ""}`);
		// Open devTool if the app is not packaged
		// viewVideoWin.webContents.openDevTools();
	} else {
		viewVideoWin.loadFile(indexHtml, {
			hash: `viewVideo?url=${search?.url || ""}`,
		});
	}

	viewVideoWin.once("ready-to-show", async () => {
		viewVideoWin?.show();
		const filePath = getHistoryVideo();
		let video = await readDirectoryVideo(filePath);
		viewVideoWin?.webContents.send("vv:set-video", video);
	});

	return viewVideoWin;
}

function openViewVideoWin(search?: any) {
	if (!viewVideoWin || viewVideoWin?.isDestroyed()) {
		viewVideoWin = createViewVideoWin(search);
	}
	viewVideoWin.show();
}

function closeViewVideoWin() {
	viewVideoWin?.close();
	viewVideoWin = null;
}

function hideViewVideoWin() {
	viewVideoWin?.hide();
}

function minimizeViewVideoWin() {
	viewVideoWin?.minimize();
}

function maximizeViewVideoWin() {
	viewVideoWin?.maximize();
}

function unmaximizeViewVideoWin() {
	viewVideoWin?.unmaximize();
}

function setAlwaysOnTopViewVideoWin(isAlwaysOnTop: boolean) {
	viewVideoWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function getHistoryVideoPath() {
	const historyVideoPath = (getHistoryVideo() as string) || "";
	return historyVideoPath;
}

async function sendHistoryVideo() {
	const filePath = getHistoryVideoPath();
	let video = await readDirectoryVideo(filePath);
	return video;
}

export {
	createViewVideoWin,
	openViewVideoWin,
	closeViewVideoWin,
	hideViewVideoWin,
	minimizeViewVideoWin,
	maximizeViewVideoWin,
	unmaximizeViewVideoWin,
	setAlwaysOnTopViewVideoWin,
	sendHistoryVideo,
};
