import { Application, Request, Response } from "express";
import * as db from "../db";

export function initApi(app: Application) {
	app.get("/", (req: Request, res: Response) => {
		res.send("Hello World!");
	});

	app.get("/getUser", (req: Request, res: Response) => {
		const user = db.getUser();
		res.json({ code: 0, data: user });
	});

	app.get("/getFilePath", (req: Request, res: Response) => {
		const filePath = db.getFilePath();
		res.json({ code: 0, data: filePath });
	});

	app.post("/setFilePath", (req: Request, res: Response) => {
		const { filePath } = req.body;
		db.setFilePath(filePath);
		res.json({ code: 0 });
	});

	app.get("/getHistoryImg", (req: Request, res: Response) => {
		const historyImg = db.getHistoryImg();
		res.json({ code: 0, data: historyImg });
	});

	app.post("/setHistoryImg", (req: Request, res: Response) => {
		const { historyImg } = req.body;
		db.setHistoryImg(historyImg);
		res.json({ code: 0 });
	});

	app.get("/getHistoryVideo", (req: Request, res: Response) => {
		const historyVideo = db.getHistoryVideo();
		res.json({ code: 0, data: historyVideo });
	});

	app.post("/setHistoryVideo", (req: Request, res: Response) => {
		const { historyVideo } = req.body;
		db.setHistoryVideo(historyVideo);
		res.json({ code: 0 });
	});

	app.get("/getHistoryAudio", (req: Request, res: Response) => {
		const historyAudio = db.getHistoryAudio();
		res.json({ code: 0, data: historyAudio });
	});

	app.post("/setHistoryAudio", (req: Request, res: Response) => {
		const { historyAudio } = req.body;
		db.setHistoryAudio(historyAudio);
		res.json({ code: 0 });
	});
}
