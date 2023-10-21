const express = require("express");
const {
	Register,
	GetAllUsers,
	GetAllActiveUsers,
	GetUserByID,
	UpdateUser,
	DeleteUser,
	GetUsersByRoleID,
	GetUsersByTeamID,
} = require("../../controllers/userController");
const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const { saveUser } = require("../../middlewares/UserAuth");
const { CheckImage } = require("../../middlewares/imageAuth");
const verifyJWT = require("../../middlewares/verifyJWT");
const VerifyRole = require("../../middlewares/verifyRole");

const userRouter = express.Router();

userRouter.post(
	"/users",
	verifyJWT,
	VerifyRole,
	CheckImage,
	saveUser,
	Register,
);
userRouter.get("/users", verifyJWT, VerifyRole, GetAllUsers);
userRouter.get("/users-active", GetAllActiveUsers);
userRouter.get("/users/:id", verifyJWT, VerifyRole, GetUserByID);
userRouter.get("/users/team/:id", GetUsersByTeamID);
userRouter.get("/users/role/:id", verifyJWT, VerifyRole, GetUsersByRoleID);
userRouter.put(
	"/users/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("users"),
	saveUser,
	CheckImage,
	UpdateUser,
);
userRouter.delete("/users/:id", verifyJWT, VerifyRole, DeleteUser);
module.exports = userRouter;
