import { app, BrowserWindow, dialog, shell, screen, Rectangle } from "electron";
import { unlink } from "node:fs";
import { join } from "node:path";
import Ffmpeg from "fluent-ffmpeg";
import FfmpegPath from "ffmpeg-static";
import Jimp from "jimp";
import { preload, url, DIST, ICON } from "../main/utils";
import { getFilePath, setHistoryVideo } from "../main/store";
import { closeClipScreenWin, getBoundsClipScreenWin } from "./clipScreenWin";
import { openViewVideoWin } from "./viewVideoWin";

FfmpegPath &&
	Ffmpeg.setFfmpegPath(
		url ? FfmpegPath : FfmpegPath.replace("app.asar", "app.asar.unpacked"),
	);
const recorderScreenHtml = join(DIST, "./recorderScreen.html");
let ffmpegProcess: any | null = null;
let recorderScreenWin: BrowserWindow | null = null;
let downloadSet: Set<string> = new Set();

function createRecorderScreenWin(clipScreenWinBounds?: any): BrowserWindow {
	if (clipScreenWinBounds) {
		let { x, y, width, height } = clipScreenWinBounds;
		let recorderScreenWinX = x;
		let recorderScreenWinY = y + height;

		recorderScreenWin = new BrowserWindow({
			title: "pear-rec 录屏",
			icon: ICON,
			x: recorderScreenWinX,
			y: recorderScreenWinY,
			width: width,
			height: 34,
			autoHideMenuBar: true, // 自动隐藏菜单栏
			frame: false, // 无边框窗口
			hasShadow: false, // 窗口是否有阴影
			fullscreenable: false, // 窗口是否可以进入全屏状态
			alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
			skipTaskbar: true,
			webPreferences: {
				preload,
			},
		});
	} else {
		recorderScreenWin = new BrowserWindow({
			title: "pear-rec 录屏",
			icon: ICON,
			height: 34,
			// autoHideMenuBar: true, // 自动隐藏菜单栏
			// frame: false, // 无边框窗口
			hasShadow: false, // 窗口是否有阴影
			fullscreenable: false, // 窗口是否可以进入全屏状态
			// alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
			// skipTaskbar: true,
			webPreferences: {
				preload,
			},
		});
	}

	if (url) {
		recorderScreenWin.loadURL(url + "recorderScreen.html");
		// recorderScreenWin.webContents.openDevTools();
	} else {
		recorderScreenWin.loadFile(recorderScreenHtml);
	}

	recorderScreenWin?.webContents.session.on(
		"will-download",
		(event: any, item: any, webContents: any) => {
			const url = item.getURL();
			if (downloadSet.has(url)) {
				const fileName = item.getFilename();
				const filePath = getFilePath();
				const rsFilePath = join(`${filePath}/rs`, `${fileName}`);
				item.setSavePath(rsFilePath);

				item.once("done", (event: any, state: any) => {
					if (state === "completed") {
						ffmpegRecorderScreenWin(fileName);
					}
				});
			}
		},
	);

	return recorderScreenWin;
}

async function ffmpegRecorderScreenWin(fileName?: string) {
	const filePath = getFilePath();
	const { x, y, width, height } = getBoundsClipScreenWin() as Rectangle;
	const name = `pear-rec_${+new Date()}.mp4`;
	const rsInputPath = join(`${filePath}/rs`, `${fileName}`);
	const rsOutputPath = join(`${filePath}/rs`, `${name}`);
	ffmpegProcess = Ffmpeg(rsInputPath)
		.on("progress", function (progress) {
			console.log("Processing: " + progress.percent + "% done");
		})
		.on("start", (commandLine) => {
			console.log("ffmpeg started with command: ", commandLine);
		})
		.on("end", (stdout, stderr) => {
			console.log("ffmpeg finished: ", stderr);

			setHistoryVideo(rsOutputPath);
			setTimeout(() => {
				closeRecorderScreenWin();
				openViewVideoWin();
				unlink(rsInputPath, (err) => {
					if (err) {
						return console.error(err);
					}
					console.log(`ffmpeg: ${rsInputPath} 文件删除成功！`);
				});
			}, 500);
		})
		.on("error", (err) => {
			console.log("ffmpeg error: ", err.message);
		})
		.videoFilters(`crop=${width - 3}:${height - 3}:${x + 2}:${y + 2}`)
		// .format('mp4')
		.save(rsOutputPath);
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

function downloadURLRecorderScreenWin(url: string) {
	recorderScreenWin?.webContents.downloadURL(url);
	downloadSet.add(url);
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

function shotScreen(imgUrl: any) {
	const { x, y, width, height } = getBoundsClipScreenWin() as Rectangle;
	const filePath = getFilePath() as any;
	const result = join(`${filePath}/ss`, `shotScreen_${+new Date()}.jpg`);
	Jimp.read(imgUrl, function (err, img) {
		if (err) {
			console.log(`err: shotScreen ${err}`);
		} else {
			img.crop(x + 1, y + 1, width - 2, height - 2).write(result);

			setTimeout(() => {
				recorderScreenWin?.webContents.send("rs:get-shot-screen", result);
				// closeRecorderScreenWin();
				// shell.showItemInFolder(result);
			}, 500);
		}
	});
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
	shotScreen,
};
