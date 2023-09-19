import express, { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initGoogleProxy } from "./proxy/google";
import { initBaiduProxy } from "./proxy/baidu";
import { initApi } from "./api/index";
import { initUser } from "./db/initUser";
import { initDb } from "./db/index";

const PORT = 7896;

function initServe() {
	const app: Application = express();

	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: true }));

	initDb();
	initUser();
	initGoogleProxy(app);
	initBaiduProxy(app);
	initApi(app);

	app.listen(PORT, () => {
		console.log(`@pear-rec/serve is http://localhost:${PORT}`);
	});
}

initServe();
