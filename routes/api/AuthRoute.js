const express = require("express");
const {
	Login,
	handleLogout,
	GetProfile,
	updateProfile,
} = require("../../controllers/authController");
const {
	handleRefreshToken,
} = require("../../controllers/refreshTokenController");
const verifyJWT = require("../../middlewares/verifyJWT");
const VerifyRole = require("../../middlewares/verifyRole");
const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const { CheckImage } = require("../../middlewares/imageAuth");

const AuthRouter = express.Router();

AuthRouter.post("/auth/login", Login);
AuthRouter.get("/auth/logout", handleLogout);
AuthRouter.get("/auth/profile", verifyJWT, GetProfile);
AuthRouter.put(
	"/auth/profile",
	verifyJWT,
	CheckImage,
	CheckAllowedUpdates("users"),
	updateProfile,
);
AuthRouter.get("/auth/refreshToken", handleRefreshToken);

module.exports = AuthRouter;
