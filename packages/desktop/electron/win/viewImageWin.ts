import {
	BrowserWindow,
	dialog,
	shell,
	DownloadItem,
	WebContents,
} from "electron";
import { join, dirname } from "node:path";
import {
	PUBLIC,
	readDirectory,
	readDirectoryImg,
	preload,
	url,
	indexHtml,
} from "../main/utils";
import { getHistoryImg, getFilePath } from "../main/store";

let viewImageWin: BrowserWindow | null = null;
let savePath: string = "";

function createViewImageWin(search?: any): BrowserWindow {
	viewImageWin = new BrowserWindow({
		title: "pear-rec 图片预览",
		icon: join(PUBLIC, "/imgs/logo/logo@2x.ico"),
		minHeight: 400,
		minWidth: 400,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		webPreferences: {
			preload,
		},
	});

	if (url) {
		viewImageWin.loadURL(url + `#/viewImage?url=${search?.url || ""}`);
		// Open devTool if the app is not packaged
		// viewImageWin.webContents.openDevTools();
	} else {
		viewImageWin.loadFile(indexHtml, {
			hash: `viewImage?url=${search?.url || ""}`,
		});
	}

	viewImageWin.once("ready-to-show", async () => {
		viewImageWin?.show();
	});

	viewImageWin?.webContents.session.on(
		"will-download",
		(e: any, item: DownloadItem, webContents: WebContents) => {
			const fileName = item.getFilename();
			const filePath = getFilePath() as string;
			const ssFilePath = join(savePath || `${filePath}/ss`, `${fileName}`);
			item.setSavePath(ssFilePath);
			item.once("done", (event: any, state: any) => {
				if (state === "completed") {
					setTimeout(() => {
						shell.showItemInFolder(ssFilePath);
					}, 1000);
				}
			});
		},
	);

	return viewImageWin;
}

function openViewImageWin(search?: boolean) {
	if (!viewImageWin || viewImageWin?.isDestroyed()) {
		viewImageWin = createViewImageWin(search);
	}
	viewImageWin.show();
}

function closeViewImageWin() {
	viewImageWin?.close();
	viewImageWin = null;
}

function destroyViewImageWin() {
	viewImageWin?.destroy();
	viewImageWin = null;
}

function hideViewImageWin() {
	viewImageWin?.hide();
}

function minimizeViewImageWin() {
	viewImageWin?.minimize();
}

function maximizeViewImageWin() {
	viewImageWin?.maximize();
}

function unmaximizeViewImageWin() {
	viewImageWin?.unmaximize();
}

function getIsAlwaysOnTopViewImageWin() {
	return viewImageWin?.isAlwaysOnTop();
}

function setIsAlwaysOnTopViewImageWin(isAlwaysOnTop: boolean) {
	viewImageWin?.setAlwaysOnTop(isAlwaysOnTop);
	return isAlwaysOnTop;
}

function getHistoryImgPath() {
	const historyImgPath = (getHistoryImg() as string) || "";
	return historyImgPath;
}

async function sendHistoryImg() {
	const filePath = getHistoryImgPath();
	let img = await readDirectoryImg(filePath);
	return img;
}

function getSsImgPath() {
	const filePath = getFilePath() as string;
	const ssFilePath = `${filePath}/ss`;
	return ssFilePath;
}

async function getSsImgs() {
	const ssFilePath = getSsImgPath();
	let imgs = await readDirectory(ssFilePath);
	return imgs;
}

async function downloadImgViewImageWin(img: any) {
	savePath = await showOpenDialogViewImageWin();
	viewImageWin?.webContents.downloadURL(img.url);
}

async function showOpenDialogViewImageWin() {
	let res = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});

	const savePath = res.filePaths[0] || "";

	return savePath;
}

export {
	createViewImageWin,
	openViewImageWin,
	closeViewImageWin,
	hideViewImageWin,
	minimizeViewImageWin,
	maximizeViewImageWin,
	unmaximizeViewImageWin,
	getIsAlwaysOnTopViewImageWin,
	setIsAlwaysOnTopViewImageWin,
	sendHistoryImg,
	getSsImgs,
	downloadImgViewImageWin,
};
