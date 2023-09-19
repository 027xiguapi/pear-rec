import {
	BrowserWindow,
	dialog,
	shell,
	DownloadItem,
	WebContents,
} from "electron";
import { join, dirname } from "node:path";
import { ICON, preload, url, DIST } from "../main/contract";
import { getImgsByImgUrl, readDirectoryImg } from "../main/utils";
import { getHistoryImg, getFilePath } from "../main/api";

const viewImageHtml = join(DIST, "./viewImage.html");
let viewImageWin: BrowserWindow | null = null;
let savePath: string = "";
let downloadSet: Set<string> = new Set();

function createViewImageWin(search?: any): BrowserWindow {
	viewImageWin = new BrowserWindow({
		title: "pear-rec 图片预览",
		icon: ICON,
		autoHideMenuBar: true, // 自动隐藏菜单栏
		webPreferences: {
			preload,
		},
	});

	const imgUrl = search?.imgUrl || "";

	if (url) {
		viewImageWin.loadURL(url + `viewImage.html?imgUrl=${imgUrl}`);
		// Open devTool if the app is not packaged
		// viewImageWin.webContents.openDevTools();
	} else {
		viewImageWin.loadFile(viewImageHtml, {
			search: `?imgUrl=${imgUrl}`,
		});
	}

	viewImageWin.once("ready-to-show", async () => {
		viewImageWin?.show();
	});

	viewImageWin?.webContents.session.on(
		"will-download",
		async (e: any, item: DownloadItem, webContents: WebContents) => {
			const url = item.getURL();
			if (downloadSet.has(url)) {
				const fileName = item.getFilename();
				const filePath = (await getFilePath()) as string;
				const ssFilePath = join(savePath || `${filePath}/ss`, `${fileName}`);
				item.setSavePath(ssFilePath);
				item.once("done", (event: any, state: any) => {
					if (state === "completed") {
						setTimeout(() => {
							console.log(ssFilePath);
							shell.showItemInFolder(ssFilePath);
						}, 1000);
					}
				});
			}
		},
	);

	return viewImageWin;
}

function openViewImageWin(search?: any) {
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

async function getHistoryImgPath() {
	const historyImgPath = ((await getHistoryImg()) as string) || "";
	return historyImgPath;
}

async function sendHistoryImg() {
	const filePath = await getHistoryImgPath();
	let img = await readDirectoryImg(filePath);
	return img;
}

async function getSsImgPath() {
	const filePath = (await getFilePath()) as string;
	const ssFilePath = `${filePath}/ss`;
	return ssFilePath;
}

async function getImgs(imgUrl: any) {
	let imgs = await getImgsByImgUrl(imgUrl);
	return imgs;
}

async function downloadImgViewImageWin(img: any) {
	savePath = await showOpenDialogViewImageWin();
	downloadSet.add(img.url);
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
	getImgs,
	downloadImgViewImageWin,
};
