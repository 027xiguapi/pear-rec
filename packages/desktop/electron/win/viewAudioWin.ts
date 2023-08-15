import { BrowserWindow } from "electron";
import { join } from "node:path";
import { ICON, getAudiosByAudioUrl, preload, url, DIST } from "../main/utils";
import { getHistoryAudio } from "../main/store";

const viewAudioHtml = join(DIST, "./src/viewAudio.html");
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
		viewAudioWin.loadURL(url + `viewAudio.html?url=${search?.url || ""}`);
		// Open devTool if the app is not packaged
		viewAudioWin.webContents.openDevTools();
	} else {
		viewAudioWin.loadFile(viewAudioHtml, {
			hash: `?url=${search?.url || ""}`,
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
	if (!viewAudioWin?.isDestroyed()) {
		viewAudioWin?.close();
	}
	viewAudioWin = null;
}

async function getAudios(audioUrl?: any) {
	let audios = await getAudiosByAudioUrl(audioUrl);
	console.log(audios);
	return audios;
}

export { createViewAudioWin, openViewAudioWin, closeViewAudioWin, getAudios };
