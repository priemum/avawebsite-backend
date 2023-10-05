const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateEnquiryForm,
	GetAllEnquiryForms,
	GetEnquiryFormByID,
	GetEnquiryFormsByGuestEmail,
	DeleteEnquiryForm,
} = require("../../controllers/enquiryFormController");
const { saveEnquiry } = require("../../middlewares/EnquiryAuth");

const enquiryFormRouter = express.Router();

enquiryFormRouter.post("/enquiry", saveEnquiry, CreateEnquiryForm);
enquiryFormRouter.get("/enquiry", verifyJWT, VerifyRole, GetAllEnquiryForms);
enquiryFormRouter.get(
	"/enquiry/:id",
	verifyJWT,
	VerifyRole,
	GetEnquiryFormByID,
);
enquiryFormRouter.get(
	"/enquiry/email/:email",
	verifyJWT,
	VerifyRole,
	GetEnquiryFormsByGuestEmail,
);
enquiryFormRouter.delete(
	"/enquiry/:id",
	verifyJWT,
	VerifyRole,
	DeleteEnquiryForm,
);

module.exports = enquiryFormRouter;
