import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	rmSync("dist-electron", { recursive: true, force: true });

	const isServe = command === "serve";
	const isBuild = command === "build";
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
	return {
		root: path.resolve(__dirname, "src"),
		base: "./",
		publicDir: path.resolve(__dirname, "public"),
		resolve: {
			alias: {
				"@": path.join(__dirname, "src"),
			},
		},
		build: {
			rollupOptions: {
				input: {
					index: path.resolve(__dirname, "src/index.html"),
					shotScreen: path.resolve(__dirname, "src/shotScreen.html"),
					recorderScreen: path.resolve(__dirname, "src/recorderScreen.html"),
					recorderVideo: path.resolve(__dirname, "src/recorderVideo.html"),
					recorderAudio: path.resolve(__dirname, "src/recorderAudio.html"),
					viewImage: path.resolve(__dirname, "src/viewImage.html"),
					viewVideo: path.resolve(__dirname, "src/viewVideo.html"),
					setting: path.resolve(__dirname, "src/setting.html"),
					clipScreen: path.resolve(__dirname, "src/clipScreen.html"),
					editImage: path.resolve(__dirname, "src/editImage.html"),
					viewAudio: path.resolve(__dirname, "src/viewAudio.html"),
				},
			},
			outDir: path.resolve(__dirname, "dist"),
		},
		plugins: [
			react(),
			electron([
				{
					// Main-Process entry file of the Electron App.
					entry: "electron/main/index.ts",
					onstart(options) {
						if (process.env.VSCODE_DEBUG) {
							console.log(
								/* For `.vscode/.debug.script.mjs` */ "[startup] Electron App",
							);
						} else {
							options.startup();
						}
					},
					vite: {
						build: {
							sourcemap,
							minify: isBuild,
							outDir: "dist-electron/main",
							rollupOptions: {
								external: Object.keys(
									"dependencies" in pkg ? pkg.dependencies : {},
								),
							},
						},
					},
				},
				{
					entry: "electron/preload/index.ts",
					onstart(options) {
						// Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
						// instead of restarting the entire Electron App.
						options.reload();
					},
					vite: {
						build: {
							sourcemap: sourcemap ? "inline" : undefined, // #332
							minify: isBuild,
							outDir: "dist-electron/preload",
							rollupOptions: {
								external: Object.keys(
									"dependencies" in pkg ? pkg.dependencies : {},
								),
							},
						},
					},
				},
			]),
			// Use Node.js API in the Renderer-process
			renderer(),
		],
		// server: {
		// 	headers: {
		// 		"Cross-Origin-Embedder-Policy": "require-corp",
		// 		"Cross-Origin-Opener-Policy": "same-origin",
		// 	},
		// },
		server:
			process.env.VSCODE_DEBUG &&
			(() => {
				const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
				return {
					host: url.hostname,
					port: +url.port,
				};
			})(),
		clearScreen: false,
	};
});
