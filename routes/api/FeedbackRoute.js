const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateFeedback,
	GetAllFeedbacks,
	GetFeedbackByID,
	DeleteFeedback,
	GetFeedbacksByGuestEmail,
} = require("../../controllers/feedbackController");

const feedbackRouter = express.Router();

feedbackRouter.post("/feedback", CreateFeedback);
feedbackRouter.get("/feedback", verifyJWT, VerifyRole, GetAllFeedbacks);
feedbackRouter.get("/feedback/:id", verifyJWT, VerifyRole, GetFeedbackByID);
feedbackRouter.get(
	"/feedback/email/:email",
	verifyJWT,
	VerifyRole,
	GetFeedbacksByGuestEmail,
);
feedbackRouter.delete("/feedback/:id", verifyJWT, VerifyRole, DeleteFeedback);

module.exports = feedbackRouter;
