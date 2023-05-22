import {
	app,
	BrowserWindow,
	shell,
	dialog,
	DownloadItem,
	WebContents,
} from "electron";
import path from "node:path";
import { getScreenSize, preload, url, indexHtml } from "./utils";

let shotScreenWin: BrowserWindow | null = null;
let savePath: string = "";

function createShotScreenWin(): BrowserWindow {
	const { width, height } = getScreenSize();
	shotScreenWin = new BrowserWindow({
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

	// shotScreenWin.webContents.openDevTools();
	// shotScreenWindow.setIgnoreMouseEvents(true);

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
			console.log(e);
			console.log(item);
			console.log(webContents);
			const fileName = item.getFilename();
			// const filePath = app.getPath("downloads") + "/" + item.getFilename();
			const filePath = path.join(
				savePath || app.getPath("downloads"),
				item.getFilename(),
			);
			console.log(filePath);
			item.setSavePath(filePath);

			item.once("done", (event: any, state: any) => {
				if (state === "completed") {
					console.log("Download successfully");
					setTimeout(() => {
						closeShotScreenWin();
						shell.showItemInFolder(filePath);
					}, 1000);
				}
			});
		},
	);

	return shotScreenWin;
}

// 打开关闭录屏窗口
function closeShotScreenWin() {
	shotScreenWin?.isDestroyed() && shotScreenWin?.close();
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

	const filePath = res.filePaths[0] || "";

	return filePath;
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
