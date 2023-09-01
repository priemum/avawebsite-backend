const express = require("express");
const {
	CreateRole,
	GetAllRoles,
	GetAllActiveRoles,
	GetRoleByID,
	UpdateRole,
	DeleteRole,
} = require("../../controllers/roleController");
const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const roleRouter = express.Router();

roleRouter.post("/role", CreateRole);
roleRouter.get("/role", GetAllRoles);
roleRouter.get("/role/:id", GetRoleByID);
roleRouter.get("/role-active", GetAllActiveRoles);
roleRouter.put("/role/:id", CheckAllowedUpdates("role"), UpdateRole);
roleRouter.delete("/role/:id", DeleteRole);

module.exports = roleRouter;
