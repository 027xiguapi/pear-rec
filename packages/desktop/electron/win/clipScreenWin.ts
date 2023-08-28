import { app, BrowserWindow, dialog, shell, screen } from "electron";
import { join, dirname } from "node:path";
import { ICON, preload, url, DIST, PUBLIC } from "../main/contract";
import {
	openRecorderScreenWin,
	setBoundsRecorderScreenWin,
	showRecorderScreenWin,
	hideRecorderScreenWin,
} from "./recorderScreenWin";

const clipScreenHtml = join(DIST, "./clipScreen.html");
let clipScreenWin: BrowserWindow | null = null;

function createClipScreenWin(): BrowserWindow {
	clipScreenWin = new BrowserWindow({
		title: "pear-rec_clipScreenWin",
		icon: ICON,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		frame: false, // 无边框窗口
		resizable: true, // 窗口大小是否可调整
		transparent: true, // 使窗口透明
		fullscreenable: false, // 窗口是否可以进入全屏状态
		alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
		// skipTaskbar: true,
		webPreferences: {
			preload,
		},
	});

	if (url) {
		clipScreenWin.loadURL(url + "clipScreen.html");
		// clipScreenWin.webContents.openDevTools();
	} else {
		clipScreenWin.loadFile(clipScreenHtml);
	}

	clipScreenWin.on("resize", () => {
		const clipScreenWinBounds = getBoundsClipScreenWin();
		setBoundsRecorderScreenWin(clipScreenWinBounds);
	});

	clipScreenWin.on("move", () => {
		const clipScreenWinBounds = getBoundsClipScreenWin();
		setBoundsRecorderScreenWin(clipScreenWinBounds);
	});

	clipScreenWin.on("restore", () => {
		showRecorderScreenWin();
	});

	clipScreenWin.on("minimize", () => {
		hideRecorderScreenWin();
	});

	return clipScreenWin;
}

function closeClipScreenWin() {
	clipScreenWin?.isDestroyed() || clipScreenWin?.close();
	clipScreenWin = null;
}

function showClipScreenWin() {
	clipScreenWin?.show();
}

function openClipScreenWin() {
	if (!clipScreenWin || clipScreenWin?.isDestroyed()) {
		clipScreenWin = createClipScreenWin();
	}

	clipScreenWin?.show();
	const bounds = getBoundsClipScreenWin();
	openRecorderScreenWin(bounds);
}

function getBoundsClipScreenWin() {
	return clipScreenWin?.getBounds();
}

function hideClipScreenWin() {
	clipScreenWin?.hide();
}

function setAlwaysOnTopClipScreenWin(isAlwaysOnTop: boolean) {
	clipScreenWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function setMovableClipScreenWin(movable: boolean) {
	clipScreenWin?.setMovable(movable);
}

function setResizableClipScreenWin(resizable: boolean) {
	clipScreenWin?.setResizable(resizable);
}

function minimizeClipScreenWin() {
	clipScreenWin?.minimize();
}

function setIgnoreMouseEventsClipScreenWin(
	event: any,
	ignore: boolean,
	options?: any,
) {
	clipScreenWin?.setIgnoreMouseEvents(ignore, options);
}

function setIsPlayClipScreenWin(isPlay: boolean) {
	clipScreenWin?.webContents.send("cs:set-isPlay", isPlay);
}

function setBoundsClipScreenWin(width: number, height: number) {
	clipScreenWin?.setBounds({
		width: width,
		height: height,
	});
}

export {
	showClipScreenWin,
	closeClipScreenWin,
	openClipScreenWin,
	hideClipScreenWin,
	getBoundsClipScreenWin,
	setAlwaysOnTopClipScreenWin,
	setIgnoreMouseEventsClipScreenWin,
	setMovableClipScreenWin,
	setResizableClipScreenWin,
	setIsPlayClipScreenWin,
	minimizeClipScreenWin,
	setBoundsClipScreenWin,
};
