import { Router } from "express";
import { Repository } from "sequelize-typescript";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, mkdirSync } from "node:fs";
import { User } from "../users/User";
import { History } from "./History";
import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const { type, userUuid } = req.body;
		const documentsPath = join(homedir(), "Documents");
		const filePath = join(documentsPath, `./Pear Files/${userUuid}/${type}`);
		if (!existsSync(filePath)) {
			mkdirSync(filePath, { recursive: true });
		}
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		const fileTypeMap = {
			ss: "png",
			rs: "webm",
			ei: "png",
		};
		const type = req.body.type;
		const fileType = fileTypeMap[type] || "webm";
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${type}-${uniqueSuffix}.${fileType}`);
	},
});
const upload = multer({ storage: storage });

export const historyRouterFactory: any = (
	userRepository: Repository<User>,
	historyRepository: Repository<History>,
) =>
	Router()
		.get("/historys", (req, res, next) =>
			historyRepository
				.findAll()
				.then((historys) => res.json({ code: 0, data: historys }))
				.catch(next),
		)

		.get("/history/:id", (req, res, next) =>
			historyRepository
				.findByPk(req.params.id)
				.then((history) =>
					history
						? res.json({ code: 0, data: history })
						: next({ statusCode: 404 }),
				)
				.catch(next),
		)

		.post("/saveFile", upload.single("file"), async (req: any, res, next) => {
			const user = await userRepository.findOne({ where: { userType: "1" } });
			let data = {
				filePath: req.file.path,
				fileType: req.body.type,
				userId: user.id,
			};
			return historyRepository
				.create(data)
				.then((history) => res.json({ code: 0, data: history }))
				.catch(next);
		})

		.post("/addHistory", (req, res, next) =>
			historyRepository
				.create(req.body)
				.then((history) => res.json({ code: 0, data: history }))
				.catch(next),
		)

		.post("/editHistory/:id", (req, res, next) =>
			historyRepository
				.update(req.body, { where: { id: req.params.id } })
				.then((history) => res.json({ code: 0, data: history }))
				.catch(next),
		)

		.post("/deleteHistory/:id", (req, res, next) =>
			historyRepository
				.destroy({
					where: {
						id: req.params.id,
					},
				})
				.then((history) => res.json({ code: 0, data: history }))
				.catch(next),
		);
