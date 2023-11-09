import jsonfile from "jsonfile";
import * as fs from "node:fs";
import { v5 as uuidv5 } from "uuid";
import dayjs from "dayjs";
import { configFile, filePath } from "./contract";

export function initConfig() {
	let config: any = {};
	try {
		config = jsonfile.readFileSync(configFile);
		config.user || (config.user = initUser());
	} catch (err) {
		console.log("initConfig :", err);
		config.user = initUser();
	}
	return config;
}

export function initUser() {
	const uuid = uuidv5("https://www.w3.org/", uuidv5.URL);
	const user = {
		uuid: uuid,
		userName: `pear-rec:user`,
		userType: 1,
		createdAt: dayjs().format(),
	};
	try {
		if (!fs.existsSync(filePath)) {
			// 检查目录是否存在
			fs.mkdirSync(filePath, { recursive: true }); // 不存在则创建目录
		}
		jsonfile.writeFileSync(
			configFile,
			{ user: user },
			{ spaces: 2, EOL: "\r\n" },
		);
	} catch (err) {
		console.log("initUser :", err);
	}
	return user;
}

export function editUser(key: string, value: string, cb?: Function) {
	try {
		jsonfile.readFile(configFile).then((config) => {
			const user = config.user;
			user[key] = value;
			jsonfile
				.writeFile(configFile, { user: user }, { spaces: 2, EOL: "\r\n" })
				.then(() => {
					cb && cb();
				});
		});
	} catch (err) {
		console.log("editUser :", err);
	}
}
