import { UserController } from "../controller/UserController";

const userController = new UserController();

export const UserRoutes = [
	{
		path: "/users",
		method: "get",
		action: userController.getUsers,
	},
	{
		path: "/addUser",
		method: "post",
		action: userController.createUser,
	},
	{
		path: "/getUser/:id",
		method: "get",
		action: userController.getUser,
	},
	{
		path: "/editUser/:id",
		method: "get",
		action: userController.updateUser,
	},
	{
		path: "/deleteUser/:id",
		method: "get",
		action: userController.deleteUser,
	},
	{
		path: "/getCurrentUser",
		method: "get",
		action: userController.getCurrentUser,
	},
];
