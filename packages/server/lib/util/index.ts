import fs from "node:fs";
import { join, dirname, extname, basename } from "node:path";

export function getImgsByImgUrl(imgUrl: string, isElectron: boolean) {
	let imgs: any[] = [];
	let index = 0;
	let currentIndex = 0;
	try {
		const directoryPath = dirname(imgUrl);
		const files = fs.readdirSync(directoryPath); // 读取目录内容
		const protocol = isElectron
			? "pearrec:///"
			: "http://localhost:5000/getFile?url=";

		files.forEach((file) => {
			const filePath = join(directoryPath, file);

			if (isImgFile(filePath)) {
				filePath == imgUrl && (currentIndex = index);
				imgs.push({ url: `${protocol}${filePath}`, index });
				index++;
			}
		});
	} catch (err) {
		console.log("getImgsByImgUrl", err);
	}
	return { imgs, currentIndex };
}

function isImgFile(filePath: string): boolean {
	const ext = extname(filePath).toLowerCase();
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

export function getAudiosByAudioUrl(audioUrl: string, isElectron: boolean) {
	const directoryPath = dirname(audioUrl);
	const files = fs.readdirSync(directoryPath); // 读取目录内容
	const protocol = isElectron ? "pearrec:///" : "/getFile?url=";
	let audios: any[] = [];
	let index = 0;
	files.forEach((file) => {
		const filePath = join(directoryPath, file);
		if (isAudioFile(filePath)) {
			const fileName = basename(filePath);
			if (filePath == audioUrl) {
				audios.unshift({
					url: `${protocol}${filePath}`,
					name: fileName,
					cover: "./imgs/music.png",
				});
			} else {
				audios.push({
					url: `${protocol}${filePath}`,
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
	const ext = extname(filePath).toLowerCase();
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

export function getVideosByVideoUrl(videoUrl: string, isElectron: boolean) {
	const directoryPath = dirname(videoUrl);
	const files = fs.readdirSync(directoryPath); // 读取目录内容
	const protocol = isElectron ? "pearrec:///" : "/getFile?url=";
	let videos: any[] = [];
	let index = 0;
	files.forEach((file) => {
		const filePath = join(directoryPath, file);
		if (isVideoFile(filePath)) {
			const fileName = basename(filePath);
			if (filePath == videoUrl) {
				videos.unshift({
					url: `${filePath}`,
					name: fileName,
					cover: "./imgs/music.png",
				});
			} else {
				videos.push({
					url: `${filePath}`,
					name: fileName,
					cover: "./imgs/music.png",
				});
			}
			index++;
		}
	});
	return videos;
}

function isVideoFile(filePath: string): boolean {
	const ext = extname(filePath).toLowerCase();
	return [".mp4", ".mkv", ".avi", ".mov", ".wmv"].includes(ext);
}
