import {
	app,
	BrowserWindow,
	webContents,
	ipcMain,
	desktopCapturer,
	dialog,
} from "electron";

import { hideMainWin, showMainWin, minimizeMainWin } from "../win/mainWin";
import {
	closeShotScreenWin,
	openShotScreenWin,
	downloadURLShotScreenWin,
} from "../win/shotScreenWin";
import {
	openRecorderScreenWin,
	closeRecorderScreenWin,
	hideRecorderScreenWin,
	minimizeRecorderScreenWin,
	downloadURLRecorderScreenWin,
	setSizeRecorderScreenWin,
	setIgnoreMouseEventsRecorderScreenWin,
	getBoundsRecorderScreenWin,
	setMovableRecorderScreenWin,
	setResizableRecorderScreenWin,
	getCursorScreenPointRecorderScreenWin,
	isFocusedRecorderScreenWin,
	focusRecorderScreenWin,
} from "../win/recorderScreenWin";
import {
	closeClipScreenWin,
	openClipScreenWin,
	hideClipScreenWin,
	getBoundsClipScreenWin,
	setIgnoreMouseEventsClipScreenWin,
	setMovableClipScreenWin,
	setResizableClipScreenWin,
	minimizeClipScreenWin,
	setIsPlayClipScreenWin,
	setBoundsClipScreenWin,
} from "../win/clipScreenWin";
import {
	closeRecorderAudioWin,
	openRecorderAudioWin,
	hideRecorderAudioWin,
	minimizeRecorderAudioWin,
	downloadURLRecorderAudioWin,
	setSizeRecorderAudioWin,
} from "../win/recorderAudioWin";
import {
	closeRecorderVideoWin,
	openRecorderVideoWin,
	downloadURLRecorderVideoWin,
} from "../win/recorderVideoWin";
import {
	openViewImageWin,
	closeViewImageWin,
	hideViewImageWin,
	minimizeViewImageWin,
	maximizeViewImageWin,
	unmaximizeViewImageWin,
	getIsAlwaysOnTopViewImageWin,
	setIsAlwaysOnTopViewImageWin,
	sendHistoryImg,
	getSsImgs,
	downloadImgViewImageWin,
} from "../win/viewImageWin";
import {
	openViewVideoWin,
	closeViewVideoWin,
	hideViewVideoWin,
	minimizeViewVideoWin,
	maximizeViewVideoWin,
	unmaximizeViewVideoWin,
	setAlwaysOnTopViewVideoWin,
	sendHistoryVideo,
} from "../win/viewVideoWin";
import { openSettingWin, closeSettingWin } from "../win/settingWin";
import { saveFile, getScreenSize } from "./utils";
import {
	setHistory,
	setHistoryImg,
	setHistoryVideo,
	getHistory,
	getHistoryImg,
	getHistoryVideo,
	getUser,
	getFilePath,
	setFilePath,
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

	// 录屏
	ipcMain.on("rs:open-win", () => {
		closeRecorderScreenWin();
		hideMainWin();
		openRecorderScreenWin();
	});

	ipcMain.on("rs:close-win", () => {
		closeRecorderScreenWin();
		showMainWin();
	});

	ipcMain.on("rs:hide-win", () => {
		hideRecorderScreenWin();
	});

	ipcMain.on("rs:minimize-win", () => {
		minimizeRecorderScreenWin();
	});

	ipcMain.handle("rs:get-desktop-capturer-source", async () => {
		return [
			...(await desktopCapturer.getSources({ types: ["screen"] })),
			...(await selfWindws()),
		];
	});

	ipcMain.on("rs:download-record", async (e, downloadUrl) => {
		downloadURLRecorderScreenWin(downloadUrl);
		openViewVideoWin();
	});

	ipcMain.on("rs:start-record", (event) => {
		setMovableRecorderScreenWin(false);
		setResizableRecorderScreenWin(false);
		setMovableClipScreenWin(false);
		setResizableClipScreenWin(false);
		setIgnoreMouseEventsClipScreenWin(event, true, { forward: true });
		setIsPlayClipScreenWin(true);
	});

	ipcMain.on("rs:pause-record", (event) => {
		setMovableRecorderScreenWin(true);
		setResizableRecorderScreenWin(true);
		setMovableClipScreenWin(true);
		setResizableClipScreenWin(true);
		setIgnoreMouseEventsClipScreenWin(event, false);
		setIsPlayClipScreenWin(false);
	});

	ipcMain.on("rs:stop-record", (event) => {
		setMovableRecorderScreenWin(true);
		setResizableRecorderScreenWin(true);
		setMovableClipScreenWin(true);
		setResizableClipScreenWin(true);
		setIgnoreMouseEventsClipScreenWin(event, false);
		setIsPlayClipScreenWin(false);
	});

	ipcMain.handle("rs:close-record", () => {
		// setMovableRecorderScreenWin(true);
		// setResizableRecorderScreenWin(true);
		return getBoundsRecorderScreenWin();
	});

	ipcMain.handle("rs:get-cursor-screen-point", () => {
		return getCursorScreenPointRecorderScreenWin();
	});

	ipcMain.handle("rs:is-focused", () => {
		return isFocusedRecorderScreenWin();
	});

	ipcMain.on("rs:focus", () => {
		focusRecorderScreenWin();
	});

	// 录屏截图
	ipcMain.on("cs:open-win", () => {
		closeClipScreenWin();
		hideMainWin();
		openClipScreenWin();
	});

	ipcMain.on("cs:close-win", () => {
		closeClipScreenWin();
		closeRecorderScreenWin();
	});

	ipcMain.on("cs:hide-win", () => {
		hideClipScreenWin();
		hideRecorderScreenWin();
	});

	ipcMain.on("cs:minimize-win", () => {
		minimizeClipScreenWin();
	});

	ipcMain.on("cs:set-bounds", (event, width, height) => {
		setBoundsClipScreenWin(width, height);
	});

	ipcMain.on("cs:set-ignore-mouse-events", (event, ignore, options) => {
		setIgnoreMouseEventsRecorderScreenWin(event, ignore, options);
	});

	ipcMain.handle("cs:get-bounds", () => getBoundsClipScreenWin());

	// 截图
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

	ipcMain.on("ss:save-img", async (e, downloadUrl) => {
		downloadURLShotScreenWin(downloadUrl);
		await openViewImageWin(true);
	});

	ipcMain.on("ss:download-img", async (e, downloadUrl) => {
		downloadURLShotScreenWin(downloadUrl, true);
	});

	ipcMain.handle("ss:get-desktop-capturer-source", async () => {
		return [
			...(await desktopCapturer.getSources({ types: ["screen"] })),
			...(await selfWindws()),
		];
	});

	// 图片展示
	ipcMain.on("vi:open-win", (e, search) => {
		openViewImageWin(search);
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

	ipcMain.handle("vi:set-always-on-top", () => {
		const isAlwaysOnTop = getIsAlwaysOnTopViewImageWin();
		return setIsAlwaysOnTopViewImageWin(!isAlwaysOnTop);
	});

	ipcMain.handle("vi:set-img", async () => {
		const imgs = await sendHistoryImg();
		return imgs;
	});

	ipcMain.handle("vi:set-imgs", async () => {
		const imgs = await getSsImgs();
		return imgs;
	});

	ipcMain.on("vi:download-img", (e, img) => {
		downloadImgViewImageWin(img);
	});

	// 视频音频展示
	ipcMain.on("vv:open-win", (e, search) => {
		openViewVideoWin(search);
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

	ipcMain.handle("vv:set-video", async () => {
		const video = await sendHistoryVideo();
		return video;
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

	// 录音
	ipcMain.on("ra:open-win", () => {
		closeRecorderAudioWin();
		hideMainWin();
		openRecorderAudioWin();
	});

	ipcMain.on("ra:close-win", () => {
		closeRecorderAudioWin();
		showMainWin();
	});

	ipcMain.on("ra:hide-win", () => {
		hideRecorderAudioWin();
	});

	ipcMain.on("ra:minimize-win", () => {
		minimizeRecorderAudioWin();
	});

	ipcMain.on("ra:download-record", (e, downloadUrl) => {
		downloadURLRecorderAudioWin(downloadUrl);
	});

	ipcMain.on("ra:start-record", () => {
		setSizeRecorderAudioWin(285, 43);
	});

	ipcMain.on("ra:pause-record", () => {
		setSizeRecorderAudioWin(260, 43);
	});

	ipcMain.on("ra:stop-record", () => {});

	// 录像
	ipcMain.on("rv:open-win", () => {
		closeRecorderVideoWin();
		hideMainWin();
		openRecorderVideoWin();
	});

	ipcMain.on("rv:close-win", () => {
		closeRecorderVideoWin();
		showMainWin();
	});

	ipcMain.on("rv:download-record", (e, downloadUrl) => {
		downloadURLRecorderVideoWin(downloadUrl);
	});

	// 设置
	ipcMain.on("se:open-win", () => {
		closeSettingWin();
		openSettingWin();
	});

	ipcMain.on("se:close-win", () => {
		closeSettingWin();
		showMainWin();
	});

	ipcMain.handle("se:set-filePath", async () => {
		let res = await dialog.showOpenDialog({
			properties: ["openDirectory"],
		});
		let filePath = "";
		if (res.canceled) {
			filePath = "";
		} else {
			filePath = res.filePaths[0] || "";
			setFilePath(filePath);
		}
		return filePath;
	});

	ipcMain.handle("se:get-filePath", () => {
		return getFilePath();
	});

	ipcMain.handle("se:get-user", () => {
		return getUser();
	});

	ipcMain.on("se:set-openAtLogin", (e, isOpen) => {
		app.setLoginItemSettings({ openAtLogin: isOpen });
	});

	ipcMain.handle("se:get-openAtLogin", () => {
		return app.getLoginItemSettings();
	});
}
