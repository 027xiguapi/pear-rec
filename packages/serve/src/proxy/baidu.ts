import { Application, Request, Response } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export function initBaiduProxy(app: Application) {
	app.use(
		"/apiBaidu",
		createProxyMiddleware({
			target: "https://graph.baidu.com/",
			changeOrigin: true,
			secure: false,
			logLevel: "debug",
			pathRewrite: {
				"^/apiBaidu": "",
			},
		}),
	);
}
