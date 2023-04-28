import { app, screen, BrowserWindow, desktopCapturer, ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const createWindow = (): BrowserWindow => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: path.join(__dirname, "../renderer/assets/imgs/logo@2x.ico"),
		height: 600,
		width: 800,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			sandbox: false,
			// nodeIntegration: true, // makd sure to use `path` and `fs` in react module
			// enableRemoteModule: true,
			// contextIsolation: true
			// webSecurity: false,
			// enableRemoteModule: true,
			// contextIsolation: true,
			// webSecurity: false
		},
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	// Open the DevTools.
	isDev && mainWindow.webContents.openDevTools();

	return mainWindow;
};

export { createWindow };
