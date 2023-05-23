import { app, BrowserWindow, dialog, shell } from "electron";
import { preload, url, indexHtml, PUBLIC } from "./utils";
import { join, dirname } from "node:path";

let recorderAudioWin: BrowserWindow | null = null;

function createRecorderAudioWin(): BrowserWindow {
	recorderAudioWin = new BrowserWindow({
		title: "录音",
		icon: join(PUBLIC, "logo@2x.ico"),
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
		alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// recorderAudioWin.setIgnoreMouseEvents(true);

	if (url) {
		recorderAudioWin.loadURL(url + "#/recorderAudio");
		recorderAudioWin.webContents.openDevTools();
	} else {
		recorderAudioWin.loadFile(indexHtml, {
			hash: "recorderAudio",
		});
	}
	// recorderAudioWin.maximize();
	// recorderAudioWin.setFullScreen(true);

	recorderAudioWin?.webContents.session.on(
		"will-download",
		(event: any, item: any, webContents: any) => {
			const fileName = item.getFilename();
			// const filePath = "G:\\rs\\aaa.wav";
			const filePath = app.getPath("downloads") + "/" + item.getFilename();
			// const filePath = join("/rs", item.getFilename());
			// 无需对话框提示， 直接将文件保存到路径
			item.setSavePath(filePath);

			item.on("updated", (event: any, state: any) => {
				if (state === "interrupted") {
					console.log("Download is interrupted but can be resumed");
				} else if (state === "progressing") {
					if (item.isPaused()) {
						console.log("Download is paused");
					} else {
						console.log(`Received bytes: ${item.getReceivedBytes()}`);
					}
				}
			});
			item.once("done", (event: any, state: any) => {
				if (state === "completed") {
					console.log("Download successfully");
					setTimeout(() => {
						closeRecorderAudioWin();
						// shell.showItemInFolder(filePath);
					}, 1000);
				} else {
					console.log(`Download failed: ${state}`);
					dialog.showErrorBox(
						"下载失败",
						`文件 ${item.getFilename()} 因为某些原因被中断下载`,
					);
				}
			});
		},
	);

	return recorderAudioWin;
}

// 打开关闭录屏窗口
function closeRecorderAudioWin() {
	recorderAudioWin?.isDestroyed() || recorderAudioWin?.close();
	recorderAudioWin = null;
}

function openRecorderAudioWin() {
	if (!recorderAudioWin || recorderAudioWin?.isDestroyed()) {
		recorderAudioWin = createRecorderAudioWin();
	}
	recorderAudioWin?.show();
}

function downloadURLRecorderAudioWin(downloadUrl: string) {
	recorderAudioWin?.webContents.downloadURL(downloadUrl);
}

export {
	createRecorderAudioWin,
	closeRecorderAudioWin,
	openRecorderAudioWin,
	downloadURLRecorderAudioWin,
};
