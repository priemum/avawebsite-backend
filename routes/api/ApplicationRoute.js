const express = require("express");

const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateApplication,
	GetAllApplications,
	GetApplicationByID,
	DeleteApplication,
	GetApplicationByEmailID,
} = require("../../controllers/applicationController");
const { CheckFile } = require("../../middlewares/fileAuth");
const { saveApplicantion } = require("../../middlewares/applicationAuth");

const applicantRouter = express.Router();

applicantRouter.post(
	"/applicant",
	CheckFile,
	saveApplicantion,
	CreateApplication,
);
applicantRouter.get("/applicant", verifyJWT, VerifyRole, GetAllApplications);
applicantRouter.get(
	"/applicant/:id",
	verifyJWT,
	VerifyRole,
	GetApplicationByID,
);
applicantRouter.get(
	"/applicant/email/:email",
	verifyJWT,
	VerifyRole,
	GetApplicationByEmailID,
);
applicantRouter.delete(
	"/applicant/:id",
	verifyJWT,
	VerifyRole,
	DeleteApplication,
);

module.exports = applicantRouter;
