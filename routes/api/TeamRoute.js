const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const {
	CreateTeam,
	GetAllTeams,
	GetTeamByID,
	GetAllActiveTeams,
	UpdateTeam,
	DeleteTeam,
} = require("../../controllers/teamController");
const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");

const teamRouter = express.Router();

teamRouter.post("/team", verifyJWT, VerifyRole, CheckImage, CreateTeam);
teamRouter.get("/team", verifyJWT, VerifyRole, GetAllTeams);
teamRouter.get("/team/:id", verifyJWT, VerifyRole, GetTeamByID);
teamRouter.get("/team-active", GetAllActiveTeams);
teamRouter.put(
	"/team/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("teams"),
	CheckImage,
	UpdateTeam,
);
teamRouter.delete("/team/:id", verifyJWT, VerifyRole, DeleteTeam);

module.exports = teamRouter;
