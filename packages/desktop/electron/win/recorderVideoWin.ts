import { app, BrowserWindow, dialog, shell } from "electron";
import { join, dirname } from "node:path";
import { ICON, preload, url, DIST, PUBLIC } from "../main/contract";
import { getFilePath, setHistoryVideo } from "../main/store";

const recorderVideoHtml = join(DIST, "./recorderVideo.html");
let recorderVideoWin: BrowserWindow | null = null;
let downloadSet: Set<string> = new Set();

function createRecorderVideoWin(): BrowserWindow {
	recorderVideoWin = new BrowserWindow({
		title: "pear-rec 录像",
		icon: ICON,
		// width: 800, // 宽度(px), 默认值为 800
		// height: 600, // 高度(px), 默认值为 600
		autoHideMenuBar: true, // 自动隐藏菜单栏
		// useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
		// movable: false, // 是否可移动
		// frame: false, // 无边框窗口
		// resizable: false, // 窗口大小是否可调整
		// hasShadow: false, // 窗口是否有阴影
		// transparent: true, // 使窗口透明
		// fullscreenable: false, // 窗口是否可以进入全屏状态
		// fullscreen: false, // 窗口是否全屏
		// simpleFullscreen: false, // 在 macOS 上使用 pre-Lion 全屏
		// alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
		webPreferences: {
			preload,
		},
	});

	if (url) {
		recorderVideoWin.loadURL(url + "recorderVideo.html");
		// recorderVideoWin.webContents.openDevTools();
	} else {
		recorderVideoWin.loadFile(recorderVideoHtml);
	}

	recorderVideoWin?.webContents.session.on(
		"will-download",
		(event: any, item: any, webContents: any) => {
			const url = item.getURL();
			if (downloadSet.has(url)) {
				const fileName = item.getFilename();
				const filePath = getFilePath() as string;
				const rvFilePath = join(`${filePath}/rv`, `${fileName}`);
				item.setSavePath(rvFilePath);

				item.once("done", (event: any, state: any) => {
					if (state === "completed") {
						setHistoryVideo(rvFilePath);
						setTimeout(() => {
							closeRecorderVideoWin();
							// shell.showItemInFolder(filePath);
						}, 1000);
					} else {
						dialog.showErrorBox(
							"下载失败",
							`文件 ${item.getFilename()} 因为某些原因被中断下载`,
						);
					}
				});
			}
		},
	);

	return recorderVideoWin;
}

// 打开关闭录屏窗口
function closeRecorderVideoWin() {
	recorderVideoWin?.isDestroyed() || recorderVideoWin?.close();
	recorderVideoWin = null;
}

function openRecorderVideoWin() {
	if (!recorderVideoWin || recorderVideoWin?.isDestroyed()) {
		recorderVideoWin = createRecorderVideoWin();
	}
	recorderVideoWin?.show();
}

function downloadURLRecorderVideoWin(downloadUrl: string) {
	recorderVideoWin?.webContents.downloadURL(downloadUrl);
	downloadSet.add(downloadUrl);
}

export {
	createRecorderVideoWin,
	closeRecorderVideoWin,
	openRecorderVideoWin,
	downloadURLRecorderVideoWin,
};
