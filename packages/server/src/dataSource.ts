import "reflect-metadata";
import fs from "node:fs";
import { join, dirname } from "node:path";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Record } from "./entity/Record";
import { DB_PATH } from "./contract";

const fileDir = dirname(DB_PATH);
if (!fs.existsSync(fileDir)) {
	fs.mkdirSync(fileDir, { recursive: true });
}

export const AppDataSource = new DataSource({
	type: "better-sqlite3",
	database: DB_PATH,
	synchronize: true,
	logging: false,
	entities: [User, Record],
	migrations: [],
	subscribers: [],
});
