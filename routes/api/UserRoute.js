const express = require("express");
const {
	Register,
	GetAllUsers,
	GetAllActiveUsers,
	GetUserByID,
	UpdateUser,
	DeleteUser,
} = require("../../controllers/userController");
const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const { saveUser } = require("../../middlewares/UserAuth");
const { CheckImage } = require("../../middlewares/imageAuth");

const userRouter = express.Router();

userRouter.post("/users", CheckImage, saveUser, Register);
userRouter.get("/users", GetAllUsers);
userRouter.get("/users-active", GetAllActiveUsers);
userRouter.get("/users/:id", GetUserByID);
userRouter.put(
	"/users/:id",
	CheckAllowedUpdates("users"),
	saveUser,
	UpdateUser,
);
userRouter.delete("/users/:id", DeleteUser);
module.exports = userRouter;
