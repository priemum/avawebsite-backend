const express = require("express");

const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const { GetGeneralData } = require("../../controllers/dataController");

const dataRouter = express.Router();

dataRouter.get("/data", GetGeneralData);

module.exports = dataRouter;
