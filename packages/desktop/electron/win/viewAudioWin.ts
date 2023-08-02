import { BrowserWindow } from "electron";
import { join } from "node:path";
import {
	ICON,
	getAudiosByAudioUrl,
	preload,
	url,
	indexHtml,
} from "../main/utils";
import { getHistoryAudio } from "../main/store";

let viewAudioWin: BrowserWindow | null = null;

function createViewAudioWin(search?: any): BrowserWindow {
	viewAudioWin = new BrowserWindow({
		title: "pear-rec 视频预览",
		icon: ICON,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		webPreferences: {
			preload,
		},
	});

	if (url) {
		// electron-vite-vue#298
		viewAudioWin.loadURL(url + `#/viewAudio?url=${search?.url || ""}`);
		// Open devTool if the app is not packaged
		viewAudioWin.webContents.openDevTools();
	} else {
		viewAudioWin.loadFile(indexHtml, {
			hash: `/viewAudio?url=${search?.url || ""}`,
		});
	}

	viewAudioWin.once("ready-to-show", async () => {
		viewAudioWin?.show();
	});

	return viewAudioWin;
}

function openViewAudioWin(search?: any) {
	if (!viewAudioWin || viewAudioWin?.isDestroyed()) {
		viewAudioWin = createViewAudioWin(search);
	}
	viewAudioWin.show();
}

function closeViewAudioWin() {
	viewAudioWin?.close();
	viewAudioWin = null;
}

async function getAudios(audioUrl: any) {
	let audios = await getAudiosByAudioUrl(audioUrl);
	return audios;
}

export {
	createViewAudioWin,
	openViewAudioWin,
  closeViewAudioWin,
	getAudios,
};
