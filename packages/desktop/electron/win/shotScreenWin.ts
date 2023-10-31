import {
	app,
	BrowserWindow,
	shell,
	dialog,
	DownloadItem,
	WebContents,
	clipboard,
	nativeImage,
} from "electron";
import { join } from "node:path";
import { ICON, preload, url, DIST, WEB_URL } from "../main/contract";
import { getFilePath, setHistoryImg } from "../main/api";
import { openViewImageWin } from "./viewImageWin";

const shotScreenHtml = join(DIST, "./shotScreen.html");
let shotScreenWin: BrowserWindow | null = null;
let savePath: string = "";
let downloadSet: Set<string> = new Set();

function createShotScreenWin(): BrowserWindow {
	shotScreenWin = new BrowserWindow({
		title: "pear-rec 截屏",
		icon: ICON,
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
		webPreferences: {
			preload,
		},
	});

	// shotScreenWin.webContents.openDevTools();

	if (url) {
		shotScreenWin.loadURL(WEB_URL + "shotScreen.html");
	} else {
		shotScreenWin.loadFile(shotScreenHtml);
	}
	shotScreenWin.maximize();
	shotScreenWin.setFullScreen(true);

	shotScreenWin?.webContents.session.on(
		"will-download",
		async (e: any, item: DownloadItem, webContents: WebContents) => {
			const url = item.getURL();
			if (downloadSet.has(url)) {
				const fileName = item.getFilename();
				const filePath = (await getFilePath()) as string;
				const ssFilePath = join(savePath || `${filePath}/ss`, `${fileName}`);
				item.setSavePath(ssFilePath);
				item.once("done", (event: any, state: any) => {
					if (state === "completed") {
						copyImg(ssFilePath);
						setHistoryImg(ssFilePath);
						setTimeout(() => {
							closeShotScreenWin();
							openViewImageWin({ imgUrl: ssFilePath });
						}, 1000 * 0.5);
					}
				});
			}
		},
	);

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
	shotScreenWin?.show();
}

function showShotScreenWin() {
	shotScreenWin?.show();
}

function hideShotScreenWin() {
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

async function downloadURLShotScreenWin(
	downloadUrl: string,
	isShowDialog?: boolean,
) {
	savePath = "";
	isShowDialog && (savePath = await showOpenDialogShotScreenWin());
	downloadSet.add(downloadUrl);
	shotScreenWin?.webContents.downloadURL(downloadUrl);
}

async function showOpenDialogShotScreenWin() {
	let res = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});

	const savePath = res.filePaths[0] || "";

	return savePath;
}

function copyImg(filePath: string) {
	const image = nativeImage.createFromPath(filePath);
	clipboard.writeImage(image);
}

export {
	createShotScreenWin,
	closeShotScreenWin,
	openShotScreenWin,
	showShotScreenWin,
	hideShotScreenWin,
	minimizeShotScreenWin,
	maximizeShotScreenWin,
	unmaximizeShotScreenWin,
	downloadURLShotScreenWin,
};
