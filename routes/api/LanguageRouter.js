const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	DeleteLanguage,
	CreateLanguage,
	GetAllLanguages,
	GetLanguageByID,
	UpdateLanguage,
} = require("../../controllers/languageController");
const { CheckImage } = require("../../middlewares/imageAuth");

const languageRouter = express.Router();

languageRouter.post(
	"/language",
	verifyJWT,
	VerifyRole,
	CheckImage,
	CreateLanguage,
);
languageRouter.get("/language", verifyJWT, VerifyRole, GetAllLanguages);
languageRouter.get("/language/:id", verifyJWT, VerifyRole, GetLanguageByID);
languageRouter.put(
	"/language/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("language"),
	UpdateLanguage,
);
languageRouter.delete("/language/:id", verifyJWT, VerifyRole, DeleteLanguage);

module.exports = languageRouter;
