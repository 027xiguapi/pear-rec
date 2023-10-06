import { Router } from "express";
import { Repository } from "sequelize-typescript";
import { User } from "./User";
import { History } from "../historys/History";

export const userRouterFactory = (
	userRepository: Repository<User>,
	historyRepository: Repository<History>,
) =>
	Router()
		.get("/users", (req, res, next) =>
			userRepository
				.findAll({ include: [historyRepository] })
				.then((users) => res.json({ code: 0, data: users }))
				.catch(next),
		)

		.get("/users/:id", (req, res, next) =>
			userRepository
				.findByPk(req.params.id)
				.then((user) =>
					user ? res.json({ code: 0, data: user }) : next({ statusCode: 404 }),
				)
				.catch(next),
		)

		.get("/getCurrentUser", (req, res, next) =>
			userRepository
				.findOne({ where: { userType: "1" } })
				.then((user) =>
					user
						? res.json({ code: 0, data: user })
						: next({ statusCode: 404 }),
				)
				.catch(next),
		)

		.post("/addUser", (req, res, next) =>
			userRepository
				.create(req.body)
				.then((user) => res.json({ code: 0, data: user }))
				.catch(next),
		)

		.post("/editUser/:id", (req, res, next) =>
			userRepository
				.update(req.body, { where: { id: req.params.id } })
				.then((user) => res.json({ code: 0, data: user }))
				.catch(next),
		)

		.post("/deleteUser/:id", (req, res, next) =>
			userRepository
				.destroy({
					where: {
						id: req.params.id,
					},
				})
				.then((user) => res.json({ code: 0, data: user }))
				.catch(next),
		);
