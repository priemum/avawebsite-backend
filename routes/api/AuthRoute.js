const express = require("express");
const {
	Login,
	handleLogout,
	GetProfile,
} = require("../../controllers/authController");
const {
	handleRefreshToken,
} = require("../../controllers/refreshTokenController");

const AuthRouter = express.Router();

AuthRouter.post("/auth/login", Login);
AuthRouter.get("/auth/logout", handleLogout);
AuthRouter.get("/auth/profile", GetProfile);
AuthRouter.get("/auth/refreshToken", handleRefreshToken);

module.exports = AuthRouter;
