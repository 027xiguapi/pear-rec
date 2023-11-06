import { createServer } from "http";
import crypto from "node:crypto";
import initApp from "./app";
import { sequelize } from "./database/sequelize";

const port = process.env.PORT || 5000;
global.crypto = crypto;

const initServer = async () => {
	// await sequelize.sync({ force: true });
	await sequelize.sync();
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	const app = initApp();

	createServer(app).listen(port, () =>
		console.log(`Server listen on port ${port}`),
	);
};

export { initServer };
export default initServer;
