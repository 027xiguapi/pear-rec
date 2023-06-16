import { app, BrowserWindow, dialog, shell } from "electron";
import { join, dirname } from "node:path";
import { preload, url, indexHtml, PUBLIC } from "./utils";
import { getFilePath, setHistoryVideo } from "./store";

let recorderScreenWin: BrowserWindow | null = null;

function createRecorderScreenWin(): BrowserWindow {
	recorderScreenWin = new BrowserWindow({
		title: "pear-rec 录屏",
		icon: join(PUBLIC, "/imgs/logo/logo@2x.ico"),
		width: 330, // 宽度(px), 默认值为 800
		height: 55, // 高度(px), 默认值为 600
		// autoHideMenuBar: true, // 自动隐藏菜单栏
		// useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
		// movable: false, // 是否可移动
		frame: false, // 无边框窗口
		resizable: false, // 窗口大小是否可调整
		// hasShadow: false, // 窗口是否有阴影
		// transparent: true, // 使窗口透明
		// fullscreenable: false, // 窗口是否可以进入全屏状态
		// fullscreen: false, // 窗口是否全屏
		// simpleFullscreen: false, // 在 macOS 上使用 pre-Lion 全屏
		alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
		webPreferences: {
			preload,
		},
	});

	// recorderScreenWin.setIgnoreMouseEvents(true);

	if (url) {
		recorderScreenWin.loadURL(url + "#/recorderScreen");
		// recorderScreenWin.webContents.openDevTools();
	} else {
		recorderScreenWin.loadFile(indexHtml, {
			hash: "recorderScreen",
		});
	}
	// recorderScreenWin.maximize();
	// recorderScreenWin.setFullScreen(true);

	recorderScreenWin?.webContents.session.on(
		"will-download",
		(event: any, item: any, webContents: any) => {
			const fileName = item.getFilename();
			const filePath = getFilePath() as string;
			const rsFilePath = join(`${filePath}/rs`, `${fileName}`);
			item.setSavePath(rsFilePath);

			item.once("done", (event: any, state: any) => {
				if (state === "completed") {
					setHistoryVideo(rsFilePath);
					setTimeout(() => {
						closeRecorderScreenWin();
						// shell.showItemInFolder(filePath);
					}, 1000);
				}
			});
		},
	);

	return recorderScreenWin;
}

// 打开关闭录屏窗口
function closeRecorderScreenWin() {
	recorderScreenWin?.isDestroyed() || recorderScreenWin?.close();
	recorderScreenWin = null;
}

function openRecorderScreenWin() {
	if (!recorderScreenWin || recorderScreenWin?.isDestroyed()) {
		recorderScreenWin = createRecorderScreenWin();
	}
	recorderScreenWin?.show();
}

function hideRecorderScreenWin() {
	recorderScreenWin?.hide();
}

function minimizeRecorderScreenWin() {
	recorderScreenWin?.minimize();
}

function downloadURLRecorderScreenWin(downloadUrl: string) {
	recorderScreenWin?.webContents.downloadURL(downloadUrl);
}

function setSizeRecorderScreenWin(width: number, height: number) {
	recorderScreenWin?.setResizable(true);
	recorderScreenWin?.setSize(width, height);
	recorderScreenWin?.setResizable(false);
}

export {
	createRecorderScreenWin,
	closeRecorderScreenWin,
	openRecorderScreenWin,
	hideRecorderScreenWin,
	minimizeRecorderScreenWin,
	downloadURLRecorderScreenWin,
	setSizeRecorderScreenWin,
};
