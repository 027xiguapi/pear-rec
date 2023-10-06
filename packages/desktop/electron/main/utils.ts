import { screen } from "electron";
import * as fs from "node:fs";
import path from "node:path";
import { PEAR_FILES } from "./contract";

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
	const imagePath = path.join(PEAR_FILES, `/ss/${fileName}.${fileType}`); // 下载路径

	const directory = path.dirname(imagePath); // 获取文件目录
	if (!fs.existsSync(directory)) {
		// 检查目录是否存在
		fs.mkdirSync(directory, { recursive: true }); // 不存在则创建目录
	}
	fs.writeFileSync(imagePath, buffer); // 将buffer写入本地文件
}

function saveFile(fileInfo: any) {
	let { base64String, fileName, fileType = "png" } = fileInfo;
	fileName || (fileName = Number(new Date()));
	const url = base64String.split(",")[1]; // 移除前缀，获取base64数据部分
	const buffer = Buffer.from(url, "base64"); // 将base64数据转化为buffer
	const filePath = path.join(PEAR_FILES, `/ss/${fileName}.${fileType}`); // 下载路径

	const directory = path.dirname(filePath); // 获取文件目录
	if (!fs.existsSync(directory)) {
		// 检查目录是否存在
		fs.mkdirSync(directory, { recursive: true }); // 不存在则创建目录
	}
	fs.writeFileSync(filePath, buffer); // 将buffer写入本地文件
}

function getImgsByImgUrl(imgUrl: string) {
	const directoryPath = path.dirname(imgUrl);
	const files = fs.readdirSync(directoryPath); // 读取目录内容
	let imgs: any[] = [];
	let index = 0;
	let currentIndex = 0;
	files.forEach((file) => {
		const filePath = path.join(directoryPath, file);

		if (isImageFile(filePath)) {
			filePath == imgUrl && (currentIndex = index);
			imgs.push({ url: `pearrec:///${filePath}`, index });
			index++;
		}
	});
	return { imgs, currentIndex };
}

function isImageFile(filePath: string): boolean {
	const ext = path.extname(filePath).toLowerCase();
	return [
		".jpg",
		".jpeg",
		".jfif",
		".pjpeg",
		".pjp",
		".png",
		"apng",
		".gif",
		".bmp",
		".avif",
		".webp",
		".ico",
	].includes(ext);
}

function getAudiosByAudioUrl(audioUrl: string) {
	const directoryPath = path.dirname(audioUrl);
	const files = fs.readdirSync(directoryPath); // 读取目录内容
	let audios: any[] = [];
	let index = 0;
	files.forEach((file) => {
		const filePath = path.join(directoryPath, file);
		if (isAudioFile(filePath)) {
			const fileName = path.basename(filePath);
			if (filePath == audioUrl) {
				audios.unshift({
					url: `pearrec:///${filePath}`,
					name: fileName,
					cover: "./imgs/music.png",
				});
			} else {
				audios.push({
					url: `pearrec:///${filePath}`,
					name: fileName,
					cover: "./imgs/music.png",
				});
			}
			index++;
		}
	});
	return audios;
}

function isAudioFile(filePath: string): boolean {
	const ext = path.extname(filePath).toLowerCase();
	return [
		".mp3",
		".wav",
		".aac",
		".ogg",
		".flac",
		".aiff",
		"aif",
		".m4a",
		".alac",
		".ac3",
	].includes(ext);
}

function readDirectoryVideo(filePath: string) {
	filePath = filePath.replace(/\\/g, "/");
	return filePath && `pearrec:///${filePath}`;
}

function readDirectoryImg(filePath: string) {
	filePath = filePath.replace(/\\/g, "/");
	return filePath && `pearrec:///${filePath}`;
}

export {
	getScreenSize,
	downloadFile,
	saveFile,
	getImgsByImgUrl,
	readDirectoryVideo,
	readDirectoryImg,
	getAudiosByAudioUrl,
};
