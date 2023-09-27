const express = require("express");

const { CheckAllowedUpdates } = require("../../middlewares/AllowedUpdates");
const VerifyRole = require("../../middlewares/verifyRole");
const verifyJWT = require("../../middlewares/verifyJWT");
const {
	CreateCategory,
	GetAllCategories,
	GetCategoryByID,
	GetCategoryByParentID,
	GetAllActiveCategories,
	UpdateCategory,
	DeleteCategory,
} = require("../../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter.post("/category", verifyJWT, VerifyRole, CreateCategory);
categoryRouter.get("/category", verifyJWT, VerifyRole, GetAllCategories);
categoryRouter.get("/category/:id", GetCategoryByID);
categoryRouter.get("/category/sub-category/:id", GetCategoryByParentID);
categoryRouter.get("/category-active", GetAllActiveCategories);
categoryRouter.put(
	"/category/:id",
	verifyJWT,
	VerifyRole,
	CheckAllowedUpdates("category"),
	UpdateCategory,
);
categoryRouter.delete("/category/:id", verifyJWT, VerifyRole, DeleteCategory);

module.exports = categoryRouter;
