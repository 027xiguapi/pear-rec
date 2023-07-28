import { join } from "node:path";
import { app } from "electron";
import { v4 as uuidv4 } from "uuid";
import * as store from "./store";

function initConfig() {
	initUser();
}

function initUser() {
	let uuid = store.getUserUuid();
	if (!uuid) {
    uuid = uuidv4();
		const user = {
			uuid: uuid,
      userName: "user",
      filePath: getFilePath(uuid),
			createdTime: Number(new Date()),
		};
		store.setUser(user);
	}
}

function getFilePath(uuid: string) {
	let filePath = store.getFilePath();
	if (!filePath) {
		const documentsPath = app.getPath("documents");
		filePath = join(documentsPath, `Peer Files/${uuid}`);
	}

  return filePath;
}

export { initConfig };
