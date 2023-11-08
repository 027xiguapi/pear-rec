import "reflect-metadata";
import fs from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Record } from "./entity/Record";

const documentsPath = join(homedir(), "Documents");
const DBPath = join(documentsPath, "./Pear Files/db/pear-rec.db");
const fileDir = dirname(DBPath);
if (!fs.existsSync(fileDir)) {
	fs.mkdirSync(fileDir, { recursive: true });
}

export const AppDataSource = new DataSource({
	type: "better-sqlite3",
	database: DBPath,
	synchronize: true,
	logging: false,
	entities: [User, Record],
	migrations: [],
	subscribers: [],
});
