import { Application, Request, Response } from "express";
import { initLocalApi } from "./local";
import { initBaiduProxy } from "../proxy/baidu";
import { initGoogleProxy } from "../proxy/google";

export function initApi(app: Application) {
	initLocalApi(app);
	initBaiduProxy(app);
	initGoogleProxy(app);
}
