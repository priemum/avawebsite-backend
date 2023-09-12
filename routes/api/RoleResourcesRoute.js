const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const {
	CreateRoleResource,
	GetAllRolesResource,
	GetRoleResourceByID,
	UpdateRoleResource,
	DeleteRoleResource,
	GetRoleResourceByRoleID,
} = require("../../controllers/roleResourcesController");
const { CheckRoleResources } = require("../../middlewares/RoleResourcesAuth");
const verifyJWT = require("../../middlewares/verifyJWT");
const VerifyRole = require("../../middlewares/verifyRole");

const roleResourceRouter = express.Router();

roleResourceRouter.post(
	"/role-resource",
	verifyJWT,
	VerifyRole,
	CheckRoleResources,
	CreateRoleResource,
);
roleResourceRouter.get(
	"/role-resource",
	verifyJWT,
	VerifyRole,
	GetAllRolesResource,
);
roleResourceRouter.get(
	"/role-resource/:id",
	verifyJWT,
	VerifyRole,
	GetRoleResourceByID,
);
roleResourceRouter.get(
	"/role-resource/role/:id",
	verifyJWT,
	VerifyRole,
	GetRoleResourceByRoleID,
);
roleResourceRouter.put(
	"/role-resource/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("role-resource"),
	UpdateRoleResource,
);
roleResourceRouter.delete(
	"/role-resource/:id",
	verifyJWT,
	VerifyRole,
	DeleteRoleResource,
);

module.exports = roleResourceRouter;
