import { BrowserWindow } from "electron";
import { join } from "node:path";
import { ICON, preload, url, DIST } from "../main/contract";
import { readDirectoryVideo } from "../main/utils";
import { getHistoryVideo } from "../main/api";

const viewVideoHtml = join(DIST, "./viewVideo.html");
let viewVideoWin: BrowserWindow | null = null;

function createViewVideoWin(search?: any): BrowserWindow {
	viewVideoWin = new BrowserWindow({
		title: "pear-rec 视频预览",
		icon: ICON,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		webPreferences: {
			preload,
		},
	});

	if (url) {
		// electron-vite-vue#298
		viewVideoWin.loadURL(url + `viewVideo.html?videoUrl=${search?.url || ""}`);
		// Open devTool if the app is not packaged
		// viewVideoWin.webContents.openDevTools();
	} else {
		viewVideoWin.loadFile(viewVideoHtml, {
			search: `?videoUrl=${search?.url || ""}`,
		});
	}

	viewVideoWin.once("ready-to-show", async () => {
		viewVideoWin?.show();
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
