const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage, CheckImages } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateListing,
	GetAllListings,
	GetListingByID,
	GetListingByGuestEmail,
	DeleteListing,
	TransferToProperty,
	UpdateListing,
} = require("../../controllers/listWithUsController");

const listwithusRouter = express.Router();

listwithusRouter.post("/list-with-us", CheckImages, CreateListing);
listwithusRouter.get("/list-with-us", verifyJWT, VerifyRole, GetAllListings);
listwithusRouter.get(
	"/list-with-us/:id",
	verifyJWT,
	VerifyRole,
	GetListingByID,
);
listwithusRouter.get(
	"/list-with-us/email/:email",
	verifyJWT,
	VerifyRole,
	GetListingByGuestEmail,
);
listwithusRouter.put(
	"/list-with-us/:id",
	verifyJWT,
	VerifyRole,
	CheckImages,
	CheckAllowedUpdates("list-with-us"),
	UpdateListing,
);
listwithusRouter.delete(
	"/list-with-us/:id",
	verifyJWT,
	VerifyRole,
	DeleteListing,
);

module.exports = listwithusRouter;
