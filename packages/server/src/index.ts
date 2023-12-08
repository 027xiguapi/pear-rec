import 'reflect-metadata';
import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import { AppDataSource } from './dataSource';
import { AppRoutes } from './route/index';
import { initApi } from './api';
import { initConfig } from './config';
import { PORT } from './contract';

export default function initApp() {
  AppDataSource.initialize()
    .then(async (connection) => {
      const app = express();

      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(function (err, req, res, next) {
        console.error('server:', err.stack);
        res.status(500).send('服务器内部错误');
      });

      initConfig();
      initApi(app);

      AppRoutes.forEach((route: any) => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
          route
            .action(request, response)
            .then(() => next)
            .catch((err) => next(err));
        });
      });

      app.listen(PORT);

      console.log(`Express application is up and running on port ${PORT}`);
    })
    .catch((error) => console.log('TypeORM connection error: ', error));
}

initApp();
