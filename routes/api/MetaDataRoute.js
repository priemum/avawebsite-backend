const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");

const { CheckImage } = require("../../middlewares/imageAuth");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateMetaData,
	GetAllMetaData,
	GetMetaDataByID,
	UpdateMetaData,
	DeleteMetaData,
	GetMetaDataByArticleID,
	GetMetaDataByPropertyID,
} = require("../../controllers/metaDataController");

const MetaDataRouter = express.Router();

MetaDataRouter.post("/meta-data", verifyJWT, VerifyRole, CreateMetaData);
MetaDataRouter.get("/meta-data", verifyJWT, VerifyRole, GetAllMetaData);
MetaDataRouter.get("/meta-data/:id", verifyJWT, VerifyRole, GetMetaDataByID);
MetaDataRouter.get(
	"/meta-data/article/:id",
	verifyJWT,
	VerifyRole,
	GetMetaDataByArticleID,
);
MetaDataRouter.get(
	"/meta-data/property/:id",
	verifyJWT,
	VerifyRole,
	GetMetaDataByPropertyID,
);
MetaDataRouter.put(
	"/meta-data/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("meta-data"),
	UpdateMetaData,
);
MetaDataRouter.delete("/meta-data/:id", verifyJWT, VerifyRole, DeleteMetaData);

module.exports = MetaDataRouter;
