import { app } from "electron";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import {
	setUser,
	getUser,
	setUserUuid,
	getUserUuid,
	setUserCreatedTime,
	getUserCreatedTime,
	setHistory,
	setHistoryImg,
	setHistoryVideo,
	getHistory,
	getHistoryImg,
	getHistoryVideo,
	getFilePath,
	setFilePath,
} from "./store";

function initConfig() {
	initUser();
	initFilePath();
}

function initUser() {
	const uuid = getUserUuid();
	if (!uuid) {
		const user = {
			uuid: uuidv4(),
			createdTime: Number(new Date()),
		};
		setUser(user);
	}
}

function initFilePath() {
	const filePath = getFilePath();
	if (!filePath) {
		const documentsPath = app.getPath("documents");
		const uuid = getUserUuid() as string;
		const filePath = path.join(documentsPath, `Peer Files/${uuid}`);
		setFilePath(filePath);
	}
}

export { initConfig };
