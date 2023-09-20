import { Sequelize } from "sequelize-typescript";
import fs from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { User } from "../users/User";
import { History } from "../historys/History";

const documentsPath = join(homedir(), "Documents");
const DBPath = join(documentsPath, "./Peer Files/db/pear-rec.db");
const fileDir = dirname(DBPath);
if (!fs.existsSync(fileDir)) {
	fs.mkdirSync(fileDir, { recursive: true });
}
export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: DBPath,
	models: [User, History],
	repositoryMode: true,
});
