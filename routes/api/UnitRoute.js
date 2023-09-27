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
	GetAllUnits,
} = require("../../controllers/unitController");

const unitRouter = express.Router();

unitRouter.post("/unit", verifyJWT, VerifyRole, CreateUnit);
unitRouter.get("/unit", verifyJWT, VerifyRole, GetAllUnits);
unitRouter.get("/unit/:id", verifyJWT, VerifyRole, GetUnitByID);
unitRouter.get("/unit-active", GetAllActiveUnits);
unitRouter.put(
	"/unit/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("unit"),
	UpdateUnit,
);
unitRouter.delete("/unit/:id", verifyJWT, VerifyRole, DeleteUnit);

module.exports = unitRouter;
