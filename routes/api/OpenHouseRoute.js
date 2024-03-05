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
const {
	CreateAppointment,
	GetAllAppointments,
	GetAppointmentByID,
	DeleteAppointment,
} = require("../../controllers/openHouseController");

const openHouseRouter = express.Router();
// verifyJWT, VerifyRole,
openHouseRouter.post("/openHouse", CreateAppointment);
openHouseRouter.get("/openHouse", verifyJWT, VerifyRole, GetAllAppointments);
openHouseRouter.get(
	"/openHouse/:id",
	verifyJWT,
	VerifyRole,
	GetAppointmentByID,
);

openHouseRouter.delete(
	"/openHouse/:id",
	verifyJWT,
	VerifyRole,
	DeleteAppointment,
);

module.exports = openHouseRouter;
