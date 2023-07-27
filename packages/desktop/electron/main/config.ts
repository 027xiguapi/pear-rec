import { join } from "node:path";
import { app } from "electron";
import { v4 as uuidv4 } from "uuid";
import * as store from "./store";

function initConfig() {
	initUser();
}

function initUser() {
	const user = store.getUser() as any;
	if (!user.uuid) {
		const user = {
			uuid: uuidv4(),
      userName: "user",
      filePath: getFilePath(),
			createdTime: Number(new Date()),
		};
		store.setUser(user);
	}
}

function getFilePath() {
	let filePath = store.getFilePath();
	if (!filePath) {
		const documentsPath = app.getPath("documents");
		const uuid = store.getUserUuid() as string;
		filePath = join(documentsPath, `Peer Files/${uuid}`);
	}

  return filePath;
}

export { initConfig };
