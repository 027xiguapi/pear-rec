import fs from "node:fs";
import { Application, Request, Response } from "express";
import {
	getImgsByImgUrl,
	getAudiosByAudioUrl,
	getVideosByVideoUrl,
} from "../util/index";

export function initLocalApi(app: Application) {
	app.get("/getFile", async (req, res) => {
		const url = req.query.url as string;
		fs.readFile(url, function (err, data) {
			res.end(data);
		});
	});

	app.get("/video", function (req, res) {
		const url = req.query.url as string;
		const stat = fs.statSync(url);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

			const chunksize = end - start + 1;
			const file = fs.createReadStream(url, { start, end });
			const head = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Type": "video/mp4",
			};

			res.writeHead(206, head);
			file.pipe(res);
		} else {
			const head = {
				"Content-Length": fileSize,
				"Content-Type": "video/mp4",
			};
			res.writeHead(200, head);
			fs.createReadStream(url).pipe(res);
		}
	});

	app.get("/audio", function (req, res) {
		const url = req.query.url as string;
		const stat = fs.statSync(url);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

			const chunksize = end - start + 1;
			const file = fs.createReadStream(url, { start, end });
			const head = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Type": "audio/mp3",
			};

			res.writeHead(206, head);
			file.pipe(res);
		} else {
			const head = {
				"Content-Length": fileSize,
				"Content-Type": "audio/mp3",
			};
			res.writeHead(200, head);
			fs.createReadStream(url).pipe(res);
		}
	});

	app.get("/getImgs", async (req, res) => {
		const { imgUrl, isElectron } = req.query as any;
		const imgs = await getImgsByImgUrl(imgUrl, isElectron);
		res.json({ code: 0, data: imgs });
	});

	app.get("/getAudios", async (req, res) => {
		const { audioUrl, isElectron } = req.query as any;
		const audios = await getAudiosByAudioUrl(audioUrl, isElectron);
		res.json({ code: 0, data: audios });
	});

	app.get("/getVideos", async (req, res) => {
		const { videoUrl, isElectron } = req.query as any;
		const videos = await getVideosByVideoUrl(videoUrl, isElectron);
		res.json({ code: 0, data: videos });
	});
}
