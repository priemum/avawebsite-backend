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

const teamRouter = express.Router();

teamRouter.post("/team", CheckImage, CreateTeam);
teamRouter.get("/team", GetAllTeams);
teamRouter.get("/team/:id", GetTeamByID);
teamRouter.get("/team-active", GetAllActiveTeams);
teamRouter.put(
	"/team/:id",
	CheckAllowedUpdates("teams"),
	CheckImage,
	UpdateTeam,
);
teamRouter.delete("/team/:id", DeleteTeam);

module.exports = teamRouter;
