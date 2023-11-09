import "reflect-metadata";
import cors from "cors";
import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./dataSource";
import { AppRoutes } from "./route";
import { initApi } from "./api";
import { initConfig } from "./config";
import { PORT } from "./contract";

export default function initApp() {
	AppDataSource.initialize()
		.then(async (connection) => {
			const app = express();

			app.use(cors());
			app.use(bodyParser.urlencoded({ extended: true }));

			initConfig();
			initApi(app);

			AppRoutes.forEach((route: any) => {
				app[route.method](
					route.path,
					(request: Request, response: Response, next: Function) => {
						route
							.action(request, response)
							.then(() => next)
							.catch((err) => next(err));
					},
				);
			});

			app.listen(PORT);

			console.log(`Express application is up and running on port ${PORT}`);
		})
		.catch((error) => console.log("TypeORM connection error: ", error));
}
