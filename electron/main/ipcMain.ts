import {
	BrowserWindow,
	webContents,
	ipcMain,
	desktopCapturer,
	dialog,
} from "electron";
import { closeShotScreenWin, openShotScreenWin } from "./shotScreenWin";
import {
	openRecorderScreenWin,
	closeRecorderScreenWin,
} from "./recorderScreenWin";
import {
	openViewImageWin,
	closeViewImageWin,
	hideViewImageWin,
	minimizeViewImageWin,
	maximizeViewImageWin,
	unmaximizeViewImageWin,
	setAlwaysOnTopViewImageWin,
} from "./viewImageWin";
import {
	openViewVideoWin,
	closeViewVideoWin,
	hideViewVideoWin,
	minimizeViewVideoWin,
	maximizeViewVideoWin,
	unmaximizeViewVideoWin,
	setAlwaysOnTopViewVideoWin,
} from "./viewVideoWin";
import { hideMainWin, showMainWin, minimizeMainWin } from "./mainWin";
import { saveFile, getScreenSize } from "./utils";

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
	ipcMain.on("ma:show-win", () => {
		showMainWin();
	});

	ipcMain.on("ma:hide-win", () => {
		hideMainWin();
	});

	ipcMain.on("ma:minimize-win", () => {
		minimizeMainWin();
	});

	ipcMain.on("rs:open-win", () => {
		closeRecorderScreenWin();
		hideMainWin();
		openRecorderScreenWin();
	});

	ipcMain.on("rs:close-win", () => {
		closeRecorderScreenWin();
		showMainWin();
	});

	ipcMain.handle("ss:get-shot-screen-img", async () => {
		let { width, height } = getScreenSize();
		const sources = [
			...(await desktopCapturer.getSources({
				types: ["screen"],
				thumbnailSize: {
					width,
					height,
				},
			})),
		];
		const source = sources.filter((e: any) => e.id == "screen:0:0")[0];
		const img = source.thumbnail.toDataURL();
		return img;
	});

	ipcMain.on("ss:open-win", () => {
		closeShotScreenWin();
		hideMainWin();
		openShotScreenWin();
	});

	ipcMain.on("ss:close-win", () => {
		closeShotScreenWin();
	});

	ipcMain.on("ss:save-img", async (e, fileInfo) => {
		await saveFile(fileInfo);
		await openViewImageWin();
	});

	ipcMain.handle("ss:get-desktop-capturer-source", async (_event, _args) => {
		return [
			...(await desktopCapturer.getSources({ types: ["screen"] })),
			...(await selfWindws()),
		];
	});

	// 图片展示
	ipcMain.on("vi:open-win", () => {
		openViewImageWin();
	});

	ipcMain.on("vi:close-win", () => {
		closeViewImageWin();
	});

	ipcMain.on("vi:hide-win", () => {
		hideViewImageWin();
	});

	ipcMain.on("vi:minimize-win", () => {
		minimizeViewImageWin();
	});

	ipcMain.on("vi:maximize-win", () => {
		maximizeViewImageWin();
	});

	ipcMain.on("vi:unmaximize-win", () => {
		unmaximizeViewImageWin();
	});

	ipcMain.on("vi:set-always-on-top", (e, isAlwaysOnTop) => {
		setAlwaysOnTopViewImageWin(isAlwaysOnTop);
	});

	// 视频音频展示
	ipcMain.on("vv:open-win", () => {
		openViewVideoWin();
	});

	ipcMain.on("vv:close-win", () => {
		closeViewVideoWin();
	});

	ipcMain.on("vv:hide-win", () => {
		hideViewVideoWin();
	});

	ipcMain.on("vv:minimize-win", () => {
		minimizeViewVideoWin();
	});

	ipcMain.on("vv:maximize-win", () => {
		maximizeViewVideoWin();
	});

	ipcMain.on("vv:unmaximize-win", () => {
		unmaximizeViewVideoWin();
	});

	ipcMain.on("vv:set-always-on-top", (e, isAlwaysOnTop) => {
		setAlwaysOnTopViewVideoWin(isAlwaysOnTop);
	});

	// 打开图片
	ipcMain.handle("vi:get-images", async (event, title) => {
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
			return { src: `peerrec:///${filePath}`, key: index };
		});
		return images;
	});

	// ipcMain.on(IpcEvents.EV_SET_TITLE, (event, title) => {
	// 	const webContents = event.sender;
	// 	const win = BrowserWindow.fromWebContents(webContents);
	// 	win!.setTitle(title);
	// });

	// ipcMain.handle(
	// 	IpcEvents.EV_GET_ALL_DESKTOP_CAPTURER_SOURCE,
	// 	async (_event, _args) => {
	// 		let sources = await desktopCapturer.getSources({
	// 			types: ["screen", "window"], // 设定需要捕获的是"屏幕"，还是"窗口"
	// 			thumbnailSize: {
	// 				height: 300, // 窗口或屏幕的截图快照高度
	// 				width: 300, // 窗口或屏幕的截图快照宽度
	// 			},
	// 			fetchWindowIcons: true, // 如果视频源是窗口且有图标，则设置该值可以捕获到的窗口图标
	// 		});
	// 		return sources;
	// 	},
	// );
}
