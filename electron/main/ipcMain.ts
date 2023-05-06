import {
	BrowserWindow,
	webContents,
	ipcMain,
	desktopCapturer,
	dialog,
} from "electron";
import { IpcEvents } from "./ipcEvents";
import { createShotScreenWindow } from "./shotScreenWin";
import { createRecorderScreenWin } from "./recorderScreenWin";
import { createViewImageWin } from "./viewImageWin";
import { mainWin } from "./index";

let shotScreenWin: BrowserWindow | null = null;
let recorderScreenWin: BrowserWindow | null = null;
let viewImageWin: BrowserWindow | null = null;

const selfWindws = async () =>
	await Promise.all(
		webContents
			.getAllWebContents()
			.filter((item) => {
				const win = BrowserWindow.fromWebContents(item);
				return win && win.isVisible();
			})
			.map(async (item) => {
				const win = BrowserWindow.fromWebContents(item);
				const thumbnail = await win?.capturePage();
				return {
					name:
						win?.getTitle() + (item.devToolsWebContents === null ? "" : "-dev"), // 给dev窗口加上后缀
					id: win?.getMediaSourceId(),
					thumbnail,
					display_id: "",
					appIcon: null,
				};
			}),
	);

export function initIpcMain() {
	// 打开图片
	ipcMain.handle("get-images", async (event, title) => {
		let res = await dialog.showOpenDialog({
			title: title,
			buttonLabel: "按此打开文件",
			// defaultPath: app.getAppPath("aaa"),
			properties: ["multiSelections"],
			filters: [
				{ name: "图片", extensions: ["jpg", "jpeg", "png", "webp", "svg"] },
				// { name: "视频", extensions: ["mkv", "avi", "mp4"] },
			],
		});
		const images = res.filePaths.map((filePath, index) => {
			return { src: `myapp:///${filePath}`, key: index };
		});
		return images;
	});

	// 打开关闭主窗口
	ipcMain.on(IpcEvents.EV_OPEN_MAIN_WIN, () => {
		mainWin!.show();
	});

	ipcMain.on(IpcEvents.EV_CLOSE_MAIN_WIN, () => {
		mainWin!.hide();
	});

	ipcMain.on(IpcEvents.EV_HIDE_MAIN_WIN, () => {
		mainWin!.minimize();
	});

	// 打开关闭录屏窗口
	function closeRecorderScreenWin() {
		recorderScreenWin && recorderScreenWin.close();
		recorderScreenWin = null;
	}

	function openRecorderScreenWin() {
		recorderScreenWin = createRecorderScreenWin();
		recorderScreenWin!.show();
	}

	ipcMain.on(IpcEvents.EV_OPEN_RECORDER_SCREEN_WIN, () => {
		closeRecorderScreenWin();
		mainWin!.hide();
		openRecorderScreenWin();
	});

	ipcMain.on(IpcEvents.EV_CLOSE_RECORDER_SCREEN_WIN, () => {
		closeRecorderScreenWin();
		mainWin!.show();
	});

	// 打开关闭录屏窗口
	function closeShotScreenWin() {
		shotScreenWin && shotScreenWin.close();
		shotScreenWin = null;
	}

	function openShotScreenWin() {
		shotScreenWin = createShotScreenWindow();
		shotScreenWin!.show();
	}

	ipcMain.on(IpcEvents.EV_OPEN_SHOT_SCREEN_WIN, () => {
		closeShotScreenWin();
		mainWin!.hide();
		openShotScreenWin();
	});

	ipcMain.on(IpcEvents.EV_CLOSE_SHOT_SCREEN_WIN, async () => {
		closeShotScreenWin();
		mainWin!.show();
	});

	ipcMain.on("vi:open-win", () => {
		viewImageWin = createViewImageWin();
		viewImageWin!.show();
	});

	ipcMain.on("vi:close-win", () => {
		viewImageWin && viewImageWin.close();
		viewImageWin = null;
	});

	ipcMain.on("vi:hide-win", () => {
		viewImageWin && viewImageWin.hide();
	});

	ipcMain.on("vi:minimize-win", () => {
		viewImageWin && viewImageWin.minimize();
	});

	ipcMain.on("vi:maximize-win", () => {
		viewImageWin && viewImageWin.maximize();
	});

	ipcMain.on("vi:unmaximize-win", () => {
		viewImageWin && viewImageWin.unmaximize();
	});

	ipcMain.on("vi:set-always-on-top", (e, isAlwaysOnTop) => {
		viewImageWin!.setAlwaysOnTop(isAlwaysOnTop);
	});

	ipcMain.handle(
		IpcEvents.EV_SEND_DESKTOP_CAPTURER_SOURCE,
		async (_event, _args) => {
			return [
				...(await desktopCapturer.getSources({ types: ["screen"] })),
				...(await selfWindws()),
			];
		},
	);

	ipcMain.on(IpcEvents.EV_SET_TITLE, (event, title) => {
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);
		win!.setTitle(title);
	});

	ipcMain.handle(
		IpcEvents.EV_GET_ALL_DESKTOP_CAPTURER_SOURCE,
		async (_event, _args) => {
			let sources = await desktopCapturer.getSources({
				types: ["screen", "window"], // 设定需要捕获的是"屏幕"，还是"窗口"
				thumbnailSize: {
					height: 300, // 窗口或屏幕的截图快照高度
					width: 300, // 窗口或屏幕的截图快照宽度
				},
				fetchWindowIcons: true, // 如果视频源是窗口且有图标，则设置该值可以捕获到的窗口图标
			});
			return sources;
		},
	);
}
