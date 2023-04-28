import type { Configuration } from "webpack";
import path from "path";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push({
	test: /\.css$/,
	use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

export const rendererConfig: Configuration = {
	module: {
		rules,
	},
	plugins,
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
		alias: {
			//在 webpack 中设置代码中 @ 符号表示 src 这一层目录
			"@": path.join(__dirname, "./src/"),
			renderer: path.join(__dirname, "./src/renderer/"),
		},
	},
};
