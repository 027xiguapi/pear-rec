import { app, screen, BrowserWindow, desktopCapturer, ipcMain } from "electron";

export const isDev = process.env.NODE_ENV === "development";
// process.env.DIST_ELECTRON = join(__dirname, '../')
// process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
// process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
//   ? join(process.env.DIST_ELECTRON, '../public')
//   : process.env.DIST

function getScreenSize() {
	const { size, scaleFactor } = screen.getPrimaryDisplay();
	return {
		width: size.width * scaleFactor,
		height: size.height * scaleFactor,
	};
}

export { getScreenSize };
