const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateListing,
	GetAllListings,
	GetListingByID,
	GetListingByGuestEmail,
	DeleteListing,
	TransferToProperty,
} = require("../../controllers/listWithUsController");

const listwithusRouter = express.Router();

listwithusRouter.post("/list-with-us", CreateListing);
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
// listwithusRouter.put(
// 	"/list-with-us/transfer/:id",
// 	verifyJWT,
// 	VerifyRole,
// 	TransferToProperty,
// );
listwithusRouter.delete(
	"/list-with-us/:id",
	verifyJWT,
	VerifyRole,
	DeleteListing,
);

module.exports = listwithusRouter;
