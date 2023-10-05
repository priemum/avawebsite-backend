const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const verifyJWT = require("../../middlewares/verifyJWT");
const VerifyRole = require("../../middlewares/verifyRole");
const {
	CreateJob,
	GetAllJobs,
	GetJobByID,
	GetJobByUserID,
	GetAllActiveJobs,
	UpdateJob,
	DeleteJob,
} = require("../../controllers/jobController");

const jobRouter = express.Router();

jobRouter.post("/job", verifyJWT, VerifyRole, CreateJob);
jobRouter.get("/job", verifyJWT, VerifyRole, GetAllJobs);
jobRouter.get("/job/:id", GetJobByID);
jobRouter.get("/job/user/:id", verifyJWT, VerifyRole, GetJobByUserID);
jobRouter.get("/job-active", GetAllActiveJobs);
jobRouter.put(
	"/job/:id",
	CheckAllowedUpdates("job"),
	verifyJWT,
	VerifyRole,
	UpdateJob,
);
jobRouter.delete("/job/:id", verifyJWT, VerifyRole, DeleteJob);

module.exports = jobRouter;
