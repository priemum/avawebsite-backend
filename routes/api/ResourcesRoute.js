const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const {
	CreateResource,
	GetAllResources,
	GetResourceByID,
	GetAllActiveResources,
	DeleteResource,
	UpdateResource,
} = require("../../controllers/resourcesController");
const verifyJWT = require("../../middlewares/verifyJWT");
const VerifyRole = require("../../middlewares/verifyRole");

const resourceRouter = express.Router();

resourceRouter.post("/resource", verifyJWT, VerifyRole, CreateResource);
resourceRouter.get("/resource", verifyJWT, VerifyRole, GetAllResources);
resourceRouter.get("/resource/:id", verifyJWT, VerifyRole, GetResourceByID);
resourceRouter.get("/resource-active", GetAllActiveResources);
resourceRouter.put(
	"/resource/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("resources"),
	UpdateResource,
);
resourceRouter.delete("/resource/:id", verifyJWT, VerifyRole, DeleteResource);

module.exports = resourceRouter;
