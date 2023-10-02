const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateAminity,
	GetAllAminities,
	GetAminityByID,
	UpdateAminity,
	DeleteAminity,
} = require("../../controllers/aminitiesController");

const aminitiesRouter = express.Router();

aminitiesRouter.post(
	"/aminities",
	verifyJWT,
	VerifyRole,
	CheckImage,
	CreateAminity,
);
aminitiesRouter.get("/aminities", verifyJWT, VerifyRole, GetAllAminities);
aminitiesRouter.get("/aminities/:id", GetAminityByID);
// addressRouter.get("/address-active", GetAllActiveAddresses);
aminitiesRouter.put(
	"/aminities/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("aminities"),
	CheckImage,
	UpdateAminity,
);
aminitiesRouter.delete("/aminities/:id", verifyJWT, VerifyRole, DeleteAminity);

module.exports = aminitiesRouter;
