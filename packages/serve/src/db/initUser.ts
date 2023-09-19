import { join } from "node:path";
import { homedir } from "node:os";
import { v4 as uuidv4 } from "uuid";
import * as store from "./index";

export function initUser() {
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
		const documentsPath = join(homedir(), "Documents");
		filePath = join(documentsPath, `Peer Files/${uuid}`);
	}
	return filePath;
}
