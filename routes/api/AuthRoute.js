const express = require("express");
const { Login, handleLogout } = require("../../controllers/authController");
const {
	handleRefreshToken,
} = require("../../controllers/refreshTokenController");
const verifyJWT = require("../../middlewares/verifyJWT");

const AuthRouter = express.Router();

AuthRouter.post("/auth/login", Login);
AuthRouter.get("/auth/logout", verifyJWT, handleLogout);
AuthRouter.get("/auth/refreshToken", handleRefreshToken);

module.exports = AuthRouter;
