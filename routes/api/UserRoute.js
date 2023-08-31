const express = require("express");
const { Register } = require("../../controllers/userController");

const userRouter = express.Router();

userRouter.post("/users", Register);

module.exports = userRouter;
