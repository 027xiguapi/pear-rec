import { Application, Request, Response } from "express";
import { HttpsProxyAgent } from "https-proxy-agent";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export function initGoogleProxy(app: Application) {
	app.use(
		"/apiGoogle",
		createProxyMiddleware({
			target: "https://lens.google.com",
			changeOrigin: true,
			secure: false,
			logLevel: "debug",
			onProxyReq: fixRequestBody,
			agent: new HttpsProxyAgent("http://127.0.0.1:7890"),
			pathRewrite: {
				"^/apiGoogle": "",
			},
		}),
	);
}
