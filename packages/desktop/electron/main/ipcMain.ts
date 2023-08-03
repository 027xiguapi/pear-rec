import {
	app,
	BrowserWindow,
	webContents,
	ipcMain,
	desktopCapturer,
	dialog,
} from "electron";
import * as mainWin from "../win/mainWin";
import * as shotScreenWin from "../win/shotScreenWin";
import * as recorderScreenWin from "../win/recorderScreenWin";
import * as clipScreenWin from "../win/clipScreenWin";
import * as recorderAudioWin from "../win/recorderAudioWin";
import * as recorderVideoWin from "../win/recorderVideoWin";
import * as viewImageWin from "../win/viewImageWin";
import * as editImageWin from "../win/editImageWin";
import * as viewVideoWin from "../win/viewVideoWin";
import * as viewAudioWin from "../win/viewAudioWin";
import * as settingWin from "../win/settingWin";
import * as utils from "./utils";
import * as store from "./store";

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
		mainWin.showMainWin();
	});

	ipcMain.on("ma:hide-win", () => {
		mainWin.hideMainWin();
	});

	ipcMain.on("ma:minimize-win", () => {
		mainWin.minimizeMainWin();
	});

	// 录屏
	ipcMain.on("rs:open-win", () => {
		recorderScreenWin.closeRecorderScreenWin();
		mainWin.hideMainWin();
		recorderScreenWin.openRecorderScreenWin();
	});

	ipcMain.on("rs:close-win", () => {
		recorderScreenWin.closeRecorderScreenWin();
		mainWin.showMainWin();
	});

	ipcMain.on("rs:hide-win", () => {
		recorderScreenWin.hideRecorderScreenWin();
	});

	ipcMain.on("rs:minimize-win", () => {
		recorderScreenWin.minimizeRecorderScreenWin();
	});

	ipcMain.handle("rs:get-desktop-capturer-source", async () => {
		return [
			...(await desktopCapturer.getSources({ types: ["screen"] })),
			...(await selfWindws()),
		];
	});

	ipcMain.on("rs:download-record", async (e, url) => {
		recorderScreenWin.downloadURLRecorderScreenWin(url);
	});

	ipcMain.on("rs:start-record", (event) => {
		recorderScreenWin.setMovableRecorderScreenWin(false);
		recorderScreenWin.setResizableRecorderScreenWin(false);
		clipScreenWin.setMovableClipScreenWin(false);
		clipScreenWin.setResizableClipScreenWin(false);
		clipScreenWin.setIgnoreMouseEventsClipScreenWin(event, true, {
			forward: true,
		});
		clipScreenWin.setIsPlayClipScreenWin(true);
	});

	ipcMain.on("rs:pause-record", (event) => {
		recorderScreenWin.setMovableRecorderScreenWin(true);
		recorderScreenWin.setResizableRecorderScreenWin(true);
		clipScreenWin.setMovableClipScreenWin(true);
		clipScreenWin.setResizableClipScreenWin(true);
		clipScreenWin.setIgnoreMouseEventsClipScreenWin(event, false);
		clipScreenWin.setIsPlayClipScreenWin(false);
	});

	ipcMain.on("rs:stop-record", (event) => {
		recorderScreenWin.setMovableRecorderScreenWin(true);
		recorderScreenWin.setResizableRecorderScreenWin(true);
		clipScreenWin.setMovableClipScreenWin(true);
		clipScreenWin.setResizableClipScreenWin(true);
		clipScreenWin.setIgnoreMouseEventsClipScreenWin(event, false);
		clipScreenWin.setIsPlayClipScreenWin(false);
	});

	ipcMain.handle("rs:close-record", () => {
		// setMovableRecorderScreenWin(true);
		// setResizableRecorderScreenWin(true);
		return recorderScreenWin.getBoundsRecorderScreenWin();
	});

	ipcMain.handle("rs:get-cursor-screen-point", () => {
		return recorderScreenWin.getCursorScreenPointRecorderScreenWin();
	});

	ipcMain.handle("rs:is-focused", () => {
		return recorderScreenWin.isFocusedRecorderScreenWin();
	});

	ipcMain.on("rs:focus", () => {
		recorderScreenWin.focusRecorderScreenWin();
	});

	ipcMain.on("rs:shotScreen", async () => {
		const { width, height } = utils.getScreenSize();
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
		const img = source.thumbnail.toPNG();
		recorderScreenWin.shotScreen(img);
	});

	// 录屏截图
	ipcMain.on("cs:open-win", () => {
		clipScreenWin.closeClipScreenWin();
		mainWin.hideMainWin();
		clipScreenWin.openClipScreenWin();
	});

	ipcMain.on("cs:close-win", () => {
		clipScreenWin.closeClipScreenWin();
		recorderScreenWin.closeRecorderScreenWin();
	});

	ipcMain.on("cs:hide-win", () => {
		clipScreenWin.hideClipScreenWin();
		recorderScreenWin.hideRecorderScreenWin();
	});

	ipcMain.on("cs:minimize-win", () => {
		clipScreenWin.minimizeClipScreenWin();
	});

	ipcMain.on("cs:set-bounds", (event, width, height) => {
		clipScreenWin.setBoundsClipScreenWin(width, height);
	});

	ipcMain.on("cs:set-ignore-mouse-events", (event, ignore, options) => {
		recorderScreenWin.setIgnoreMouseEventsRecorderScreenWin(
			event,
			ignore,
			options,
		);
	});

	ipcMain.handle("cs:get-bounds", () => clipScreenWin.getBoundsClipScreenWin());

	// 截图
	ipcMain.handle("ss:get-shot-screen-img", async () => {
		const { width, height } = utils.getScreenSize();
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
		shotScreenWin.closeShotScreenWin();
		mainWin.hideMainWin();
		shotScreenWin.openShotScreenWin();
	});

	ipcMain.on("ss:close-win", () => {
		shotScreenWin.closeShotScreenWin();
	});

	ipcMain.on("ss:save-img", async (e, downloadUrl) => {
		shotScreenWin.downloadURLShotScreenWin(downloadUrl);
	});

	ipcMain.on("ss:download-img", async (e, downloadUrl) => {
		shotScreenWin.downloadURLShotScreenWin(downloadUrl, true);
	});

	ipcMain.handle("ss:get-desktop-capturer-source", async () => {
		return [
			...(await desktopCapturer.getSources({ types: ["screen"] })),
			...(await selfWindws()),
		];
	});

	// 图片展示
	ipcMain.on("vi:open-win", (e, search) => {
		viewImageWin.openViewImageWin(search);
	});

	ipcMain.on("vi:close-win", () => {
		viewImageWin.closeViewImageWin();
	});

	ipcMain.on("vi:hide-win", () => {
		viewImageWin.hideViewImageWin();
	});

	ipcMain.on("vi:minimize-win", () => {
		viewImageWin.minimizeViewImageWin();
	});

	ipcMain.on("vi:maximize-win", () => {
		viewImageWin.maximizeViewImageWin();
	});

	ipcMain.on("vi:unmaximize-win", () => {
		viewImageWin.unmaximizeViewImageWin();
	});

	ipcMain.handle("vi:set-always-on-top", () => {
		const isAlwaysOnTop = viewImageWin.getIsAlwaysOnTopViewImageWin();
		return viewImageWin.setIsAlwaysOnTopViewImageWin(!isAlwaysOnTop);
	});

	ipcMain.handle("vi:get-imgs", async (e, img) => {
		const imgs = await viewImageWin.getImgs(img);
		return imgs;
	});

	ipcMain.on("vi:download-img", (e, img) => {
		viewImageWin.downloadImgViewImageWin(img);
	});

	ipcMain.handle("vi:get-historyImg", async () => {
		const img = store.getHistoryImg();
		return img;
	});

	ipcMain.on("vi:set-historyImg", (e, img) => {
		store.setHistoryImg(img);
	});

	// 图片编辑
	ipcMain.on("ei:open-win", (e, search) => {
		editImageWin.openEditImageWin(search);
	});

	ipcMain.on("ei:save-img", async (e, downloadUrl) => {
		editImageWin.downloadEditImageWin(downloadUrl);
	});

	// 视频音频展示
	ipcMain.on("vv:open-win", (e, search) => {
		viewVideoWin.openViewVideoWin(search);
	});

	ipcMain.on("vv:close-win", () => {
		viewVideoWin.closeViewVideoWin();
	});

	ipcMain.on("vv:hide-win", () => {
		viewVideoWin.hideViewVideoWin();
	});

	ipcMain.on("vv:minimize-win", () => {
		viewVideoWin.minimizeViewVideoWin();
	});

	ipcMain.on("vv:maximize-win", () => {
		viewVideoWin.maximizeViewVideoWin();
	});

	ipcMain.on("vv:unmaximize-win", () => {
		viewVideoWin.unmaximizeViewVideoWin();
	});

	ipcMain.on("vv:set-always-on-top", (e, isAlwaysOnTop) => {
		viewVideoWin.setAlwaysOnTopViewVideoWin(isAlwaysOnTop);
	});

	ipcMain.handle("vv:get-historyVideo", async () => {
		const video = store.getHistoryVideo();
		return video;
	});

	ipcMain.on("vv:set-historyVideo", (e, video) => {
		store.setHistoryVideo(video);
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
			store.setHistoryImg(filePath);
		});
		const img = store.getHistoryImg();
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
			store.setHistoryVideo(filePath);
		});
		const video = store.getHistoryVideo();
		return video;
	});

	// 录音
	ipcMain.on("ra:open-win", () => {
		recorderAudioWin.closeRecorderAudioWin();
		mainWin.hideMainWin();
		recorderAudioWin.openRecorderAudioWin();
	});

	ipcMain.on("ra:close-win", () => {
		recorderAudioWin.closeRecorderAudioWin();
		mainWin.showMainWin();
	});

	ipcMain.on("ra:hide-win", () => {
		recorderAudioWin.hideRecorderAudioWin();
	});

	ipcMain.on("ra:minimize-win", () => {
		recorderAudioWin.minimizeRecorderAudioWin();
	});

	ipcMain.on("ra:download-record", (e, downloadUrl) => {
		recorderAudioWin.downloadURLRecorderAudioWin(downloadUrl);
	});

	ipcMain.on("ra:start-record", () => {
		recorderAudioWin.setSizeRecorderAudioWin(285, 43);
	});

	ipcMain.on("ra:pause-record", () => {
		recorderAudioWin.setSizeRecorderAudioWin(260, 43);
	});

	ipcMain.on("ra:stop-record", () => {});

	// 录像
	ipcMain.on("rv:open-win", () => {
		recorderVideoWin.closeRecorderVideoWin();
		mainWin.hideMainWin();
		recorderVideoWin.openRecorderVideoWin();
	});

	ipcMain.on("rv:close-win", () => {
		recorderVideoWin.closeRecorderVideoWin();
		mainWin.showMainWin();
	});

	ipcMain.on("rv:download-record", (e, downloadUrl) => {
		recorderVideoWin.downloadURLRecorderVideoWin(downloadUrl);
	});

	// 音频
	ipcMain.on("va:open-win", (e, search) => {
		viewAudioWin.closeViewAudioWin();
		viewAudioWin.openViewAudioWin(search);
	});

	ipcMain.handle("va:get-audios", async (e, audioUrl) => {
		const audios = await viewAudioWin.getAudios(audioUrl);
		return audios;
	});

	ipcMain.handle("va:set-historyAudio", async (e, audioUrl) => {
		store.setHistoryAudio(audioUrl);
	});

	// 设置
	ipcMain.on("se:open-win", () => {
		settingWin.closeSettingWin();
		settingWin.openSettingWin();
	});

	ipcMain.on("se:close-win", () => {
		settingWin.closeSettingWin();
		mainWin.showMainWin();
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
			store.setFilePath(filePath);
		}
		return filePath;
	});

	ipcMain.handle("se:get-filePath", () => {
		return store.getFilePath();
	});

	ipcMain.handle("se:get-user", () => {
		return store.getUser();
	});

	ipcMain.on("se:set-openAtLogin", (e, isOpen) => {
		app.setLoginItemSettings({ openAtLogin: isOpen });
	});

	ipcMain.handle("se:get-openAtLogin", () => {
		return app.getLoginItemSettings();
	});
}
