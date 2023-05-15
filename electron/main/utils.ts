import { app, screen, BrowserWindow, desktopCapturer, ipcMain } from "electron";
import * as fs from "fs";
import { join, dirname } from "node:path";

export const isDev = process.env.NODE_ENV === "development";
export const DIST_ELECTRON = join(__dirname, "../");
export const DIST = join(DIST_ELECTRON, "../dist");
export const PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(DIST_ELECTRON, "../public")
	: process.env.DIST;
export const preload = join(__dirname, "../preload/index.js");
export const url = process.env.VITE_DEV_SERVER_URL;
export const indexHtml = join(DIST, "index.html");

export const PEER_FILES = join(DIST_ELECTRON, `../Peer Files`);

function getScreenSize() {
	const { size, scaleFactor } = screen.getPrimaryDisplay();
	return {
		width: size.width * scaleFactor,
		height: size.height * scaleFactor,
	};
}

function downloadFile(fileInfo: any) {
	let { base64String, fileName, fileType = "png" } = fileInfo;
	fileName || (fileName = Number(new Date()));
	const url = base64String.split(",")[1]; // 移除前缀，获取base64数据部分
	const buffer = Buffer.from(url, "base64"); // 将base64数据转化为buffer
	const imagePath = join(PEER_FILES, `/ss/${fileName}.${fileType}`); // 下载路径

	const directory = dirname(imagePath); // 获取文件目录
	if (!fs.existsSync(directory)) {
		// 检查目录是否存在
		fs.mkdirSync(directory, { recursive: true }); // 不存在则创建目录
	}
	fs.writeFileSync(imagePath, buffer); // 将buffer写入本地文件
}

function readDirectory() {
	const directoryPath = join(PEER_FILES, "/ss");
	const files = fs.readdirSync(directoryPath); // 读取目录内容
	let images = files.map((filePath, index) => {
		return { src: `peerrec:///${directoryPath}/${filePath}`, key: index };
	});
	images = images.sort((a, b) => {
		return b.key - a.key;
	});
	return images;
}

export { getScreenSize, downloadFile, readDirectory };
