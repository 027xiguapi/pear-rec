import { createServer } from "http";
import { app } from "./app";
import { sequelize } from "./database/sequelize";

const port = process.env.PORT || 5000;

(async () => {
	// await sequelize.sync({ force: true });
	await sequelize.sync();
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	createServer(app).listen(port, () =>
		console.log(`Server listen on port ${port}`),
	);
})();
