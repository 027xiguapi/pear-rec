import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve, join } from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
	root: resolve(__dirname, "src/pages"),
	base: "./",
	publicDir: resolve(__dirname, "public"),
	resolve: {
		alias: {
			"@": join(__dirname, "src"),
		},
	},
	plugins: [react(), visualizer()],
	build: {
		target: "modules",
		minify: false,
		// cssCodeSplit: true,
		rollupOptions: {
			external: ["react", "react-dom"],
			// input: {
			// 	index: resolve(__dirname, "src/index.ts"),
			// 	home: resolve(__dirname, "src/pages/home/main.tsx"),
			// 	shotScreen: resolve(__dirname, "src/pages/shotScreen/main.tsx"),
			// 	recorderScreen: resolve(__dirname, "src/pages/recorderScreen/main.tsx"),
			// 	recorderVideo: resolve(__dirname, "src/pages/recorderVideo/main.tsx"),
			// 	recorderAudio: resolve(__dirname, "src/pages/recorderAudio/main.tsx"),
			// 	viewImage: resolve(__dirname, "src/pages/viewImage/main.tsx"),
			// 	viewVideo: resolve(__dirname, "src/pages/viewVideo/main.tsx"),
			// 	setting: resolve(__dirname, "src/pages/setting/main.tsx"),
			// 	clipScreen: resolve(__dirname, "src/pages/clipScreen/main.tsx"),
			// 	editImage: resolve(__dirname, "src/pages/editImage/main.tsx"),
			// 	viewAudio: resolve(__dirname, "src/pages/viewAudio/main.tsx"),
			// },
			output: [
				{
					format: "es",
					//不用打包成.es.js,这里我们想把它打包成.js
					entryFileNames: "[name].mjs",
					//让打包目录和我们目录对应
					preserveModules: true,
					exports: "named",
					//配置打包根目录
					dir: resolve(__dirname, `es`),
					preserveModulesRoot: "src",
				},
				{
					format: "cjs",
					entryFileNames: "[name].js",
					//让打包目录和我们目录对应
					preserveModules: true,
					exports: "named",
					//配置打包根目录
					dir: resolve(__dirname, `lib`),
					preserveModulesRoot: "src",
				},
			],
		},
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			// formats: ["es", "cjs"],
		},
	},
});
