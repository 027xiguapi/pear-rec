import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require("copy-webpack-plugin");
import path from "path";

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: "webpack-infrastructure",
	}),
	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(__dirname, "src/assets/"),
				to: path.resolve(__dirname, ".webpack/renderer/assets/"),
			},
		],
	}),
];
