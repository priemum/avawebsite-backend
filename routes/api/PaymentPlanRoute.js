const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreatePaymentPlan,
	GetAllPaymentPlans,
	GetPaymentPlanByID,
	GetPaymentPlanByPropertyUnitID,
	UpdatePaymentPlan,
	DeletePaymentPlan,
} = require("../../controllers/paymentPlanController");
const { CheckPaymentPlan } = require("../../middlewares/PaymentPlanAuth");

const paymentPlanRouter = express.Router();

paymentPlanRouter.post(
	"/paymentplan",
	verifyJWT,
	VerifyRole,
	CheckPaymentPlan,
	CreatePaymentPlan,
);
paymentPlanRouter.get("/paymentplan", GetAllPaymentPlans);
paymentPlanRouter.get("/paymentplan/:id", GetPaymentPlanByID);
paymentPlanRouter.get(
	"/paymentplan/propertyunit/:id",
	GetPaymentPlanByPropertyUnitID,
);
paymentPlanRouter.put(
	"/paymentplan/:id",
	verifyJWT,
	VerifyRole,
	// CheckAllowedUpdates("paymentplan"),
	UpdatePaymentPlan,
);
paymentPlanRouter.delete(
	"/paymentplan/:id",
	verifyJWT,
	VerifyRole,
	DeletePaymentPlan,
);

module.exports = paymentPlanRouter;
