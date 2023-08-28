import { app, screen, BrowserWindow, shell, ipcMain } from "electron";
import { ICON, preload, url, DIST } from "../main/contract";
import { join } from "node:path";

const indexHtml = join(DIST, "./index.html");
let mainWin: BrowserWindow | null = null;

const createMainWin = (): BrowserWindow => {
	mainWin = new BrowserWindow({
		title: "pear-rec",
		icon: ICON,
		width: 660, // 宽度(px)
		height: 375, // 高度(px)
		maxWidth: 660,
		maxHeight: 375,
		autoHideMenuBar: false, // 自动隐藏菜单栏
		frame: false,
		// show: false,
		// alwaysOnTop: !dev, // 为了方便调试，调试模式就不居上了
		// fullscreenable: true,
		// transparent: true,
		// frame: false,
		// resizable: process.platform == "linux", // gnome下为false时无法全屏
		// skipTaskbar: true,
		// autoHideMenuBar: true,
		// movable: false,
		// enableLargerThanScreen: true, // mac
		// hasShadow: false,
		webPreferences: {
			preload,
		},
	});

	if (url) {
		mainWin.loadURL(url + `index.html`);
		// mainWin.webContents.openDevTools();
	} else {
		mainWin.loadFile(indexHtml);
	}

	// Test actively push message to the Electron-Renderer
	// mainWin.webContents.on("did-finish-load", () => {
	// 	mainWin?.webContents.send(
	// 		"main-process-message",
	// 		new Date().toLocaleString(),
	// 	);
	// });

	// Make all links open with the browser, not with the application
	mainWin.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});

	// Apply electron-updater
	// update(mainWin);

	return mainWin;
};

function closeMainWin() {
	if (!mainWin?.isDestroyed()) {
		mainWin!.close();
	}
	mainWin = null;
}

function openMainWin() {
	mainWin = createMainWin();
	mainWin!.show();
}

function showMainWin() {
	if (!mainWin || mainWin?.isDestroyed()) {
		mainWin = createMainWin();
	}
	mainWin!.show();
}

function hideMainWin() {
	mainWin!.hide();
}

function minimizeMainWin() {
	mainWin!.minimize();
}

function maximizeMainWin() {
	mainWin!.maximize();
}

function unmaximizeMainWin() {
	mainWin!.unmaximize();
}

function focusMainWin() {
	if (mainWin) {
		// Focus on the main window if the user tried to open another
		if (mainWin.isMinimized()) mainWin.restore();
		mainWin.focus();
	}
}

export {
	mainWin,
	createMainWin,
	closeMainWin,
	openMainWin,
	hideMainWin,
	showMainWin,
	focusMainWin,
	minimizeMainWin,
};
