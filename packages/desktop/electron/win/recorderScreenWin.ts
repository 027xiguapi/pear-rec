import { app, BrowserWindow, dialog, shell, screen } from "electron";
import { join, dirname } from "node:path";
import { preload, url, indexHtml, PUBLIC } from "../main/utils";
import { getFilePath, setHistoryVideo } from "../main/store";
import { closeClipScreenWin, showClipScreenWin } from "./clipScreenWin";

let recorderScreenWin: BrowserWindow | null = null;

function createRecorderScreenWin(clipScreenWinBounds?: any): BrowserWindow {
	let { x, y, width, height } = clipScreenWinBounds;
	let recorderScreenWinX = x;
	let recorderScreenWinY = y + height;

	recorderScreenWin = new BrowserWindow({
		title: "pear-rec 录屏",
		icon: join(PUBLIC, "/imgs/logo/logo@2x.ico"),
		x: recorderScreenWinX,
		y: recorderScreenWinY,
		width: width,
		height: 34,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		frame: false, // 无边框窗口
		hasShadow: false, // 窗口是否有阴影
		resizable: false,
		// transparent: true, // 使窗口透明
		fullscreenable: false, // 窗口是否可以进入全屏状态
		alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
		skipTaskbar: true,
		webPreferences: {
			preload,
		},
	});

	if (url) {
		recorderScreenWin.loadURL(url + "#/recorderScreen");
		// recorderScreenWin.webContents.openDevTools();
	} else {
		recorderScreenWin.loadFile(indexHtml, {
			hash: "recorderScreen",
		});
	}

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
	closeClipScreenWin();
}

function openRecorderScreenWin(ClipScreenWinBounds?: any) {
	if (!recorderScreenWin || recorderScreenWin?.isDestroyed()) {
		recorderScreenWin = createRecorderScreenWin(ClipScreenWinBounds);
	}
	recorderScreenWin?.show();
}

function hideRecorderScreenWin() {
	recorderScreenWin?.hide();
}

function showRecorderScreenWin() {
	recorderScreenWin?.show();
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

function getBoundsRecorderScreenWin() {
	return recorderScreenWin?.getBounds();
}

function setMovableRecorderScreenWin(movable: boolean) {
	recorderScreenWin?.setMovable(movable);
}

function setResizableRecorderScreenWin(resizable: boolean) {
	recorderScreenWin?.setResizable(resizable);
}

function setAlwaysOnTopRecorderScreenWin(isAlwaysOnTop: boolean) {
	recorderScreenWin?.setAlwaysOnTop(isAlwaysOnTop);
}

function isFocusedRecorderScreenWin() {
	return recorderScreenWin?.isFocused();
}

function focusRecorderScreenWin() {
	recorderScreenWin?.focus();
}

function getCursorScreenPointRecorderScreenWin() {
	return screen.getCursorScreenPoint();
}

function setBoundsRecorderScreenWin(clipScreenWinBounds: any) {
	let { x, y, width, height } = clipScreenWinBounds;
	let recorderScreenWinX = x;
	let recorderScreenWinY = y + height;
	recorderScreenWin?.setBounds({
		x: recorderScreenWinX,
		y: recorderScreenWinY,
		width: width,
	});
	recorderScreenWin?.webContents.send(
		"rs:get-size-clip-win",
		clipScreenWinBounds,
	);
}

function setIgnoreMouseEventsRecorderScreenWin(
	event: any,
	ignore: boolean,
	options: any,
) {
	const win = BrowserWindow.fromWebContents(event.sender);
	win?.setIgnoreMouseEvents(ignore, options);
}

export {
	createRecorderScreenWin,
	closeRecorderScreenWin,
	openRecorderScreenWin,
	hideRecorderScreenWin,
	showRecorderScreenWin,
	minimizeRecorderScreenWin,
	downloadURLRecorderScreenWin,
	setSizeRecorderScreenWin,
	setIgnoreMouseEventsRecorderScreenWin,
	getBoundsRecorderScreenWin,
	setMovableRecorderScreenWin,
	setResizableRecorderScreenWin,
	setAlwaysOnTopRecorderScreenWin,
	getCursorScreenPointRecorderScreenWin,
	isFocusedRecorderScreenWin,
	focusRecorderScreenWin,
	setBoundsRecorderScreenWin,
};
