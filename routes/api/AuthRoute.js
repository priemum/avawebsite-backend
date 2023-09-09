const express = require("express");
const { Login, handleLogout } = require("../../controllers/authController");

const AuthRouter = express.Router();

AuthRouter.post("/auth/login", Login);
AuthRouter.get("/auth/logout", handleLogout);

module.exports = AuthRouter;
