const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage, CheckImages } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateProperty,
	GetAllProperties,
	GetPropertyByID,
	GetAllActiveProperties,
	UpdateProperty,
	DeleteProperty,
} = require("../../controllers/propertiesController");

const propertyRouter = express.Router();

propertyRouter.post(
	"/property",
	verifyJWT,
	VerifyRole,
	CheckImages,
	CreateProperty,
);
propertyRouter.get("/property", verifyJWT, VerifyRole, GetAllProperties);
propertyRouter.get("/property/:id", GetPropertyByID);
propertyRouter.get("/property-active", GetAllActiveProperties);
propertyRouter.put(
	"/property/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("property"),
	CheckImages,
	UpdateProperty,
);
propertyRouter.delete("/property/:id", verifyJWT, VerifyRole, DeleteProperty);

module.exports = propertyRouter;
