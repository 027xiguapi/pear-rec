import express, { Application, Request, Response } from "express";
import path from "node:path";

export function initPageProxy(app: Application) {
	app.use(express.static(path.resolve("public")));

	app.get("/", (req, res) => {
		res.sendFile(path.resolve("public/index.html"));
	});

	app.get("/shotScreen", (req, res) => {
		res.sendFile(path.resolve("public/shotScreen.html"));
	});

	app.get("/recorderScreen", (req, res) => {
		res.sendFile(path.resolve("public/recorderScreen.html"));
	});

	app.get("/recorderVideo", (req, res) => {
		res.sendFile(path.resolve("public/recorderVideo.html"));
	});

	app.get("/recorderAudio", (req, res) => {
		res.sendFile(path.resolve("public/recorderAudio.html"));
	});

	app.get("/viewImage", (req, res) => {
		res.sendFile(path.resolve("public/viewImage.html"));
	});

	app.get("/viewVideo", (req, res) => {
		res.sendFile(path.resolve("public/viewVideo.html"));
	});

	app.get("/setting", (req, res) => {
		res.sendFile(path.resolve("public/setting.html"));
	});

	app.get("/clipScreen", (req, res) => {
		res.sendFile(path.resolve("public/clipScreen.html"));
	});

	app.get("/editImage", (req, res) => {
		res.sendFile(path.resolve("public/editImage.html"));
	});

	app.get("/viewAudio", (req, res) => {
		res.sendFile(path.resolve("public/viewAudio.html"));
	});
}
