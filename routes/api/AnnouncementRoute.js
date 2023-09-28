const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	GetAllAnnouncements,
	CreateAnnouncement,
	GetAnnouncementByID,
	GetAllActiveAnnouncements,
	UpdateAnnouncement,
	DeleteAnnouncement,
} = require("../../controllers/announcementController");

const announcementRouter = express.Router();

announcementRouter.post(
	"/announcement",
	verifyJWT,
	VerifyRole,
	CheckImage,
	CreateAnnouncement,
);
announcementRouter.get(
	"/announcement",
	verifyJWT,
	VerifyRole,
	GetAllAnnouncements,
);
announcementRouter.get("/announcement/:id", GetAnnouncementByID);
announcementRouter.get("/announcement-active", GetAllActiveAnnouncements);
announcementRouter.put(
	"/announcement/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("announcement"),
	CheckImage,
	UpdateAnnouncement,
);
announcementRouter.delete(
	"/announcement/:id",
	verifyJWT,
	VerifyRole,
	DeleteAnnouncement,
);

module.exports = announcementRouter;
