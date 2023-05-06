import {
	app,
	screen,
	BrowserWindow,
	desktopCapturer,
	shell,
	ipcMain,
} from "electron";
import { join } from "node:path";
import { update } from "./update";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, "../public")
	: process.env.DIST;

const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

const createMainWin = (): BrowserWindow => {
	const mainWin = new BrowserWindow({
		title: "Main window",
		icon: join(process.env.PUBLIC, "logo@2x.ico"),
		webPreferences: {
			preload,
			// Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
			// Consider using contextBridge.exposeInMainWorld
			// Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (url) {
		// electron-vite-vue#298
		mainWin.loadURL(url);
		// Open devTool if the app is not packaged
		mainWin.webContents.openDevTools();
	} else {
		mainWin.loadFile(indexHtml);
	}

	// Test actively push message to the Electron-Renderer
	mainWin.webContents.on("did-finish-load", () => {
		mainWin?.webContents.send(
			"main-process-message",
			new Date().toLocaleString(),
		);
	});

	// Make all links open with the browser, not with the application
	mainWin.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});

	// Apply electron-updater
	update(mainWin);

	return mainWin;
};

export { createMainWin };
