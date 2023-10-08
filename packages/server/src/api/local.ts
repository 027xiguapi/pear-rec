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
