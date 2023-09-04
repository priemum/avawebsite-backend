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

const resourceRouter = express.Router();

resourceRouter.post("/resource", CreateResource);
resourceRouter.get("/resource", GetAllResources);
resourceRouter.get("/resource/:id", GetResourceByID);
resourceRouter.get("/resource-active", GetAllActiveResources);
resourceRouter.put(
	"/resource/:id",
	CheckAllowedUpdates("resources"),
	UpdateResource,
);
resourceRouter.delete("/resource/:id", DeleteResource);

module.exports = resourceRouter;
