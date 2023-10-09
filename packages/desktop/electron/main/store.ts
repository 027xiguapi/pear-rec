import jsonfile from "jsonfile";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { configFile } from "./contract";

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
	const uuid = uuidv4();
	const user = {
		uuid: uuid,
		userName: `pear-rec`,
		userType: 1,
		language: "zh",
		openAtLogin: false,
		createdAt: dayjs().format(),
	};
	try {
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
