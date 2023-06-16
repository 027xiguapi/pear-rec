import { app, screen, BrowserWindow, shell, ipcMain } from "electron";
import { PUBLIC, preload, url, indexHtml } from "./utils";
import { join } from "node:path";
import { update } from "./update";

let mainWin: BrowserWindow | null = null;

const createMainWin = (): BrowserWindow => {
	mainWin = new BrowserWindow({
		title: "pear-rec",
		icon: join(PUBLIC, "/imgs/logo/logo@2x.ico"),
		width: 660, // 宽度(px)
		height: 375, // 高度(px)
		maxWidth: 660,
		maxHeight: 375,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		frame: false,
		webPreferences: {
			preload,
		},
	});

	if (url) {
		mainWin.loadURL(url);
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
	mainWin!.close();
	mainWin = null;
}

function openMainWin() {
	mainWin = createMainWin();
	mainWin!.show();
}

function showMainWin() {
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
