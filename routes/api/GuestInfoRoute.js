const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateGuest,
	GetAllGuests,
	GetGuestByID,
	DeleteGuest,
} = require("../../controllers/guestInformationController");

const guestRouter = express.Router();

guestRouter.post("/guest-info", CreateGuest);
guestRouter.get("/guest-info", verifyJWT, VerifyRole, GetAllGuests);
guestRouter.get("/guest-info/:id", verifyJWT, VerifyRole, GetGuestByID);
guestRouter.delete("/guest-info/:id", verifyJWT, VerifyRole, DeleteGuest);

module.exports = guestRouter;
