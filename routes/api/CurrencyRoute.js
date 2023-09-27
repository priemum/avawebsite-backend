const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateCurrency,
	GetAllActiveCurrencies,
	GetCurrencyByID,
	UpdateCurrency,
	DeleteCurrency,
	GetAllCurrencies,
} = require("../../controllers/currencyController");

const currencyRouter = express.Router();

currencyRouter.post("/currency", verifyJWT, VerifyRole, CreateCurrency);
currencyRouter.get("/currency", verifyJWT, VerifyRole, GetAllCurrencies);
currencyRouter.get("/currency/:id", verifyJWT, VerifyRole, GetCurrencyByID);
currencyRouter.get("/currency-active", GetAllActiveCurrencies);
currencyRouter.put(
	"/currency/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("currency"),
	UpdateCurrency,
);
currencyRouter.delete("/currency/:id", verifyJWT, VerifyRole, DeleteCurrency);

module.exports = currencyRouter;
