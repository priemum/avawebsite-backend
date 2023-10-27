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
	GetPropertiesByCategoryID,
	GetActivePropertiesByCategoryID,
	GetPropertiesByAddressID,
	GetActivePropertiesByAddressID,
	GetPropertiesByDeveloperID,
	GetActivePropertiesByDeveloperID,
	DeletePropertyImages,
	DeleteImageByID,
	PropertySearch,
} = require("../../controllers/propertiesController");
const { saveProperty } = require("../../middlewares/propertyAuth");

const propertyRouter = express.Router();

propertyRouter.post(
	"/property",
	verifyJWT,
	VerifyRole,
	CheckImages,
	saveProperty,
	CreateProperty,
);
propertyRouter.get("/property", verifyJWT, VerifyRole, GetAllProperties);
propertyRouter.get("/property/:id", GetPropertyByID);
propertyRouter.get(
	"/property/category/:id",
	verifyJWT,
	VerifyRole,
	GetPropertiesByCategoryID,
);
propertyRouter.get(
	"/property-active/category/:id",
	GetActivePropertiesByCategoryID,
);
propertyRouter.get("/property/search/:searchTerm", PropertySearch);
propertyRouter.get(
	"/property/address/:id",
	verifyJWT,
	VerifyRole,
	GetPropertiesByAddressID,
);
propertyRouter.get(
	"/property-active/address/:id",
	GetActivePropertiesByAddressID,
);
propertyRouter.get(
	"/property/developer/:id",
	verifyJWT,
	VerifyRole,
	GetPropertiesByDeveloperID,
);
propertyRouter.get(
	"/property-active/developer/:id",
	GetActivePropertiesByDeveloperID,
);
propertyRouter.get("/property-active", GetAllActiveProperties);
propertyRouter.put(
	"/property/:id",
	verifyJWT,
	VerifyRole,
	CheckImages,
	CheckAllowedUpdates("property"),
	saveProperty,
	UpdateProperty,
);
propertyRouter.delete(
	"/property/images/:id",
	verifyJWT,
	VerifyRole,
	DeletePropertyImages,
);
propertyRouter.delete("/images/:id", verifyJWT, VerifyRole, DeleteImageByID);
propertyRouter.delete("/property/:id", verifyJWT, VerifyRole, DeleteProperty);

module.exports = propertyRouter;
