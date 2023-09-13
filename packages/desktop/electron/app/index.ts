import express, { Application, Request, Response } from "express";
import cors from "cors";
import { HttpsProxyAgent } from "https-proxy-agent";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export function initApp() {
	const app: Application = express();

	app.use(cors());

	app.get("/", (req: Request, res: Response) => {
		res.send("Hello World!");
	});

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

	app.listen(7896, () => {
		console.log("Express app listening on port 7896!");
	});
}
