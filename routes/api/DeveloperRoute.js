const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateDeveloper,
	GetAllActiveDevelopers,
	GetDeveloperByID,
	GetAllDevelopers,
	UpdateDeveloper,
	DeleteDeveloper,
	GetAllActiveViewDevelopers,
} = require("../../controllers/developerController");

const developerRouter = express.Router();

developerRouter.post(
	"/developer",
	verifyJWT,
	VerifyRole,
	CheckImage,
	CreateDeveloper,
);
developerRouter.get("/developer", verifyJWT, VerifyRole, GetAllDevelopers);
developerRouter.get("/developer/:id", verifyJWT, VerifyRole, GetDeveloperByID);
developerRouter.get("/developer-active", GetAllActiveDevelopers);
developerRouter.get("/developer-active-view", GetAllActiveViewDevelopers);
developerRouter.put(
	"/developer/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("developer"),
	CheckImage,
	UpdateDeveloper,
);
developerRouter.delete(
	"/developer/:id",
	verifyJWT,
	VerifyRole,
	DeleteDeveloper,
);

module.exports = developerRouter;
