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
	downloadURLRecorderScreenWin,
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
import {
	setHistory,
	setHistoryImg,
	setHistoryVideo,
	getHistory,
	getHistoryImg,
	getHistoryVideo,
} from "./store";

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

	ipcMain.handle("rs:get-desktop-capturer-source", async () => {
		return [
			...(await desktopCapturer.getSources({ types: ["screen"] })),
			...(await selfWindws()),
		];
	});

	ipcMain.on("rs:download-record", (e, fileInfo) => {
		// dialog.showOpenDialog(
		// 	{
		// 		properties: ["openFile", "openDirectory"],
		// 	},
		// 	(files: any) => {
		// 		saveUrl = files[0]; // 保存文件路径
		// 		if (!saveUrl) return; // 如果用户没有选择路径,则不再向下进行
		// 		let url = JSON.parse(args);
		// 		downloadUrl = url.downloadUrl; // 获取渲染进程传递过来的 下载链接
		// 		mainWindow.webContents.downloadURL(downloadUrl); // 触发 will-download 事件
		// 	},
		// );
		const downloadUrl = fileInfo.downloadUrl;
		downloadURLRecorderScreenWin(downloadUrl);
	});

	ipcMain.handle("ss:get-shot-screen-img", async () => {
		const { width, height } = getScreenSize();
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

	ipcMain.handle("ss:get-desktop-capturer-source", async () => {
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
			return { src: `pearrec:///${filePath}`, key: index };
		});
		return images;
	});

	ipcMain.handle("vi:get-img", async (event, title) => {
		let res = await dialog.showOpenDialog({
			title: title,
			buttonLabel: "按此打开文件",
			properties: ["openFile"],
			filters: [
				{ name: "图片", extensions: ["jpg", "jpeg", "png", "webp", "svg"] },
			],
		});
		res.filePaths.map((filePath, index) => {
			setHistoryImg(filePath);
		});
		const img = getHistoryImg();
		return img;
	});

	// 打开视频
	ipcMain.handle("vv:get-video", async (e) => {
		let res = await dialog.showOpenDialog({
			title: "选择视频",
			buttonLabel: "按此打开文件",
			properties: ["openFile"],
			filters: [{ name: "视频", extensions: ["mkv", "avi", "mp4", "webm"] }],
		});
		res.filePaths.map((filePath, index) => {
			setHistoryVideo(filePath);
		});
		const video = getHistoryVideo();
		return video;
	});
}
