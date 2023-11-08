import "reflect-metadata";
import cors from "cors";
import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./dataSource";
import { AppRoutes } from "./route";
import { initApi } from "./api/index";

const port = process.env.PORT || 5000;

export default function initApp() {
	AppDataSource.initialize()
		.then(async (connection) => {
			const app = express();

			app.use(cors());
			app.use(bodyParser.urlencoded({ extended: true }));

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

			initApi(app);

			app.listen(port);

			console.log(`Express application is up and running on port ${port}`);
		})
		.catch((error) => console.log("TypeORM connection error: ", error));
}
