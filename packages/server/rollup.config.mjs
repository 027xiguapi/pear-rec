import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
	input: "index.ts",
	output: {
		file: "dist/index.js",
		format: "cjs",
	},
	plugins: [
		nodeResolve(),
		commonjs({ ignoreDynamicRequires: true }),
		json(),
		typescript(),
	],
};
