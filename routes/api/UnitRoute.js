const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateUnit,
	GetAllActiveUnits,
	GetUnitByID,
	UpdateUnit,
	DeleteUnit,
} = require("../../controllers/unitController");

const unitRouter = express.Router();

unitRouter.post("/unit", verifyJWT, VerifyRole, CheckImage, CreateUnit);
unitRouter.get("/unit", verifyJWT, VerifyRole, GetAllActiveUnits);
unitRouter.get("/unit/:id", verifyJWT, VerifyRole, GetUnitByID);
unitRouter.get("/unit-active", GetAllActiveUnits);
unitRouter.put(
	"/unit/:id",
	verifyJWT,
	VerifyRole,
	CheckImage,
	CheckAllowedUpdates("unit"),
	UpdateUnit,
);
unitRouter.delete("/unit/:id", verifyJWT, VerifyRole, DeleteUnit);

module.exports = unitRouter;
