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
import path from "node:path";
import { getScreenSize, preload, url, indexHtml, PUBLIC } from "../main/utils";
import { getFilePath, setHistoryImg } from "../main/store";

let shotScreenWin: BrowserWindow | null = null;
let savePath: string = "";

function createShotScreenWin(): BrowserWindow {
	const { width, height } = getScreenSize();
	shotScreenWin = new BrowserWindow({
		title: "pear-rec 截屏",
		icon: path.join(PUBLIC, "/imgs/logo/logo@2x.ico"),
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
		shotScreenWin.loadURL(url + "#/shotScreen");
	} else {
		shotScreenWin.loadFile(indexHtml, {
			hash: "shotScreen",
		});
	}
	shotScreenWin.maximize();
	shotScreenWin.setFullScreen(true);

	shotScreenWin?.webContents.session.on(
		"will-download",
		(e: any, item: DownloadItem, webContents: WebContents) => {
			const fileName = item.getFilename();
			const filePath = getFilePath() as string;
			const ssFilePath = path.join(savePath || `${filePath}/ss`, `${fileName}`);
			item.setSavePath(ssFilePath);
			item.once("done", (event: any, state: any) => {
				if (state === "completed") {
					copyImg(ssFilePath);
					setHistoryImg(ssFilePath);
					setTimeout(() => {
						closeShotScreenWin();
						// shell.showItemInFolder(ssFilePath);
					}, 1000);
				}
			});
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
