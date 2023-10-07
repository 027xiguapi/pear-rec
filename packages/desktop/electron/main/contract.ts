import { app } from "electron";
import path from "node:path";

export const url = import.meta.env.VITE_WEB_URL;
export const isDev = process.env.NODE_ENV === "development";
export const preload = path.join(__dirname, "../preload/index.js");

export const DIST_ELECTRON = path.join(__dirname, "../");
export const DIST = path.join(DIST_ELECTRON, "../dist");

export const PUBLIC = isDev
	? path.join(DIST_ELECTRON, "../public")
	: process.env.DIST;
export const ICON = isDev
	? path.join(PUBLIC, "./imgs/logo/favicon.ico")
	: path.join(DIST, "./imgs/logo/favicon.ico");
export const PEAR_FILES = path.join(DIST_ELECTRON, `../Pear Files`);

const documentsPath = app.getPath("documents");
export const filePath = path.join(documentsPath, `Pear Files`);
