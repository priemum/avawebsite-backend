const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateCategory = async (req, res) => {
	try {
		const data = req.body;
		if (data.ActiveStatus) {
			console.log(data.ActiveStatus);
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		const Category = await prisma.category.create({
			data: {
				ActiveStatus: data?.ActiveStatus,
				Category_Translation: {
					createMany: {
						data: data.Category_Translation,
					},
				},
				Parent: data?.ParentID && {
					connect: {
						id: data?.ParentID,
					},
				},
			},
			include: {
				SubCategory: {
					include: {
						Category_Translation: {
							include: { Language: true },
						},
					},
				},
				Category_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Category);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			} else if (error.code === "P2002") {
				return res.status(404).send(error.message);
			} else if (error.code === "P2003") {
				return res
					.status(404)
					.send(
						"Foreign key constraint failed, Connection Field Doesn't Exist!",
					);
			}
		}
		return res.status(500).send(error.message);
	}
};

const GetAllCategories = async (req, res) => {
	try {
		const [Category, count] = await prisma.$transaction([
			prisma.category.findMany({
				include: {
					_count: true,
					Category_Translation: {
						include: { Language: true },
					},
					SubCategory: {
						include: {
							Category_Translation: {
								include: { Language: true },
							},
						},
					},
				},
			}),
			prisma.category.count(),
		]);

		if (!Category) {
			return res.status(404).send("No Categories Were Found!");
		}
		res.status(200).json({
			count,
			Category,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveCategories = async (req, res) => {
	try {
		const [Category, count] = await prisma.$transaction([
			prisma.category.findMany({
				where: { ActiveStatus: true },
				include: {
					_count: true,
					Category_Translation: {
						include: { Language: true },
					},
					SubCategory: {
						include: {
							Category_Translation: {
								include: { Language: true },
							},
						},
					},
				},
			}),
			prisma.category.count({ where: { ActiveStatus: true } }),
		]);
		if (!Category) {
			return res.status(404).send("No Categories Were Found!");
		}
		res.status(200).json({
			count,
			Category,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetCategoryByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Category = await prisma.category.findUnique({
			where: { id: id },
			include: {
				_count: true,
				Category_Translation: {
					include: { Language: true },
				},
				SubCategory: {
					include: {
						Category_Translation: {
							include: { Language: true },
						},
					},
				},
			},
		});
		if (!Category) {
			return res.status(404).send("No Categories Were Found!");
		}
		res.status(200).send(Category);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
const GetCategoryByParentID = async (req, res) => {
	try {
		const id = req.params.id;
		const [Category, count] = await prisma.$transaction([
			prisma.category.findMany({
				where: {
					ParentID: id,
				},
				include: {
					_count: true,
					Category_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.category.count({
				where: {
					ParentID: id,
				},
			}),
		]);
		if (!Category) {
			return res
				.status(404)
				.send("No Sub Categories Were Found For this Category!");
		}
		res.status(200).json({
			count,
			Category,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO: Change update articles
const UpdateCategory = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };
		updates.forEach((item) => {
			if (item !== "AddressID") Selected[item] = true;
		});
		if (image) {
			Selected["Image"] = true;
		}

		const data = await prisma.address.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Address was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		data.Longitude = parseFloat(data.Longitude);
		data.Latitude = parseFloat(data.Latitude);
		if (image) {
			if (data.Image !== null) {
				if (fs.existsSync(`.${data.Image.URL}`)) {
					fs.unlinkSync(`.${data.Image.URL}`);
				}
				await prisma.images.delete({ where: { id: data.Image.id } });
			}
			data.Image = {
				create: {
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					teamID: undefined,
				},
			};
		}
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}

		const result = await prisma.$transaction(async (prisma) => {
			data.Address_Translation &&
				data.Address_Translation.map(async (item) => {
					{
						await prisma.Address_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { addressID: id }],
							},
							data: {
								Name: item.Name,
							},
						});
					}
				});
			const UpdatedAddress = await prisma.address.update({
				where: { id: id },
				data: {
					Longitude: data?.Longitude || undefined,
					Latitude: data?.Latitude || undefined,
					ActiveStatus: data?.ActiveStatus,
					Address: data?.AddressID && {
						connect: {
							id: data?.AddressID,
						},
					},
				},
				include: {
					Address_Translation: {
						include: {
							Language: true,
						},
					},
					Addresses: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
				},
			});

			return UpdatedAddress;
		});

		return res.status(200).json({
			Message: "Updated successfully",
			result,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO : check deleting conditions
const DeleteCategory = async (req, res) => {
	try {
		const id = req.params.id;
		const Category = await prisma.category.findFirst({
			where: { id: id },
			include: {
				Category_Translation: {
					include: {
						Language: true,
					},
				},
				SubCategory: {
					include: {
						Category_Translation: {
							include: { Language: true },
						},
					},
				},
			},
		});
		if (!Category) {
			return res.status(404).send("Category Does not Exist!");
		}

		if (Category.Category_Translation.length > 0) {
			await prisma.category_Translation.deleteMany({
				where: { categoryID: id },
			});
		}
		await prisma.category.delete({ where: { id: Category.id } });
		// console.log("Role: ", Role);
		res.status(200).send(Category);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			}
		}
		return res.status(500).send(error.message);
	}
};

module.exports = {
	CreateCategory,
	GetAllCategories,
	GetCategoryByID,
	GetCategoryByParentID,
	GetAllActiveCategories,
	UpdateCategory,
	DeleteCategory,
};
