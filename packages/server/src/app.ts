import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sequelize } from "./database/sequelize";
import { userRouterFactory } from "./users/userRouterFactory";
import { historyRouterFactory } from "./historys/historyRouterFactory";
import { User } from "./users/User";
import { History } from "./historys/History";
import { initApi } from "./api/index";

const userRepository = sequelize.getRepository(User);
const historyRepository = sequelize.getRepository(History);

export default function initApp() {
	const app: Application = express();

	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(userRouterFactory(userRepository, historyRepository));
	app.use(historyRouterFactory(userRepository, historyRepository));

	initApi(app);

	return app;
}
