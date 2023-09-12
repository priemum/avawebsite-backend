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
const verifyJWT = require("../../middlewares/verifyJWT");
const VerifyRole = require("../../middlewares/verifyRole");

const roleRouter = express.Router();

roleRouter.post("/role", verifyJWT, VerifyRole, CreateRole);
roleRouter.get("/role", verifyJWT, VerifyRole, GetAllRoles);
roleRouter.get("/role/:id", verifyJWT, VerifyRole, GetRoleByID);
roleRouter.get("/role-active", GetAllActiveRoles);
roleRouter.put(
	"/role/:id",
	CheckAllowedUpdates("role"),
	verifyJWT,
	VerifyRole,
	UpdateRole,
);
roleRouter.delete("/role/:id", verifyJWT, VerifyRole, DeleteRole);

module.exports = roleRouter;
