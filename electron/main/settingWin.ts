import { app, BrowserWindow, shell } from "electron";
import { join } from "node:path";
import { getScreenSize, preload, url, indexHtml, PUBLIC } from "./utils";

let settingWin: BrowserWindow | null = null;

function createSettingWin(): BrowserWindow {
	const { width, height } = getScreenSize();
	settingWin = new BrowserWindow({
		title: "pear-rec 设置",
		icon: join(PUBLIC, "logo@2x.ico"),
		autoHideMenuBar: true, // 自动隐藏菜单栏
		width: 600, // 宽度(px)
		height: 380, // 高度(px)
		webPreferences: {
			preload,
			// Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
			// Consider using contextBridge.exposeInMainWorld
			// Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// settingWin.webContents.openDevTools();

	if (url) {
		settingWin.loadURL(url + "#/setting");
	} else {
		settingWin.loadFile(indexHtml, {
			hash: "setting",
		});
	}

	return settingWin;
}

// 打开关闭录屏窗口
function closeSettingWin() {
	settingWin?.isDestroyed() || settingWin?.close();
	settingWin = null;
}

function openSettingWin() {
	if (!settingWin || settingWin?.isDestroyed()) {
		settingWin = createSettingWin();
	}
	settingWin?.show();
}

function showSettingWin() {
	settingWin?.show();
}

function hideSettingWin() {
	settingWin?.hide();
}

export {
	createSettingWin,
	closeSettingWin,
	openSettingWin,
	showSettingWin,
	hideSettingWin,
};
