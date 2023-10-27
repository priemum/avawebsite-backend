const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateDeveloper = async (req, res) => {
	try {
		const data = req.body;
		const image = req.file;
		if (image) {
			data.Image = {
				create: {
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					user: undefined,
				},
			};
		}
		if (data.ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		if (data.ViewTag) {
			if (req.body.ViewTag.toLowerCase() === "false") {
				data.ViewTag = false;
			} else {
				data.ViewTag = true;
			}
		}
		const Developer = await prisma.developer.create({
			data: {
				ViewTag: data?.ViewTag,
				ActiveStatus: data?.ActiveStatus || undefined,
				Developer_Translation: {
					createMany: {
						data: data.Developer_Translation,
					},
				},
				Image: data?.Image,
			},
			include: {
				Image: true,
				Property: true,
				Developer_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Developer);
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

const GetAllDevelopers = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Developer, count] = await prisma.$transaction([
			prisma.developer.findMany({
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Image: true,
					Developer_Translation: {
						include: { Language: true },
					},
					Property: true,
				},
			}),
			prisma.developer.count(),
		]);

		if (!Developer) {
			return res.status(404).send("No Developers Were Found!");
		}
		res.status(200).json({
			count,
			Developer,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveDevelopers = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Developer, count] = await prisma.$transaction([
			prisma.developer.findMany({
				where: { ActiveStatus: true },
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Image: true,
					Developer_Translation: {
						include: { Language: true },
					},
					Property: true,
				},
			}),
			prisma.developer.count({ where: { ActiveStatus: true } }),
		]);
		if (!Developer) {
			return res.status(404).send("No Developers Were Found!");
		}
		res.status(200).json({
			count,
			Developer,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveViewDevelopers = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Developer, count] = await prisma.$transaction([
			prisma.developer.findMany({
				where: { AND: [{ ActiveStatus: true }, { ViewTag: true }] },
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Image: true,
					Developer_Translation: {
						include: { Language: true },
					},
					Property: true,
				},
			}),
			prisma.developer.count({
				where: { AND: [{ ActiveStatus: true }, { ViewTag: true }] },
			}),
		]);
		if (!Developer) {
			return res.status(404).send("No Developers Were Found!");
		}
		res.status(200).json({
			count,
			Developer,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetDeveloperByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Developer = await prisma.developer.findUnique({
			where: { id: id },
			include: {
				Image: true,
				Developer_Translation: {
					include: { Language: true },
				},
				Property: true,
			},
		});
		if (!Developer) {
			return res.status(404).send("No Developers Were Found!");
		}
		res.status(200).send(Developer);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateDeveloper = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
		if (image) {
			Selected["Image"] = true;
		}
		const data = await prisma.developer.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Developer was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		if (updates.includes("ViewTag")) {
			if (req.body.ViewTag.toLowerCase() === "false") {
				data.ViewTag = false;
			} else {
				data.ViewTag = true;
			}
		}
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
			data.Developer_Translation &&
				data.Developer_Translation.map(async (item) => {
					{
						await prisma.developer_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { developerID: id }],
							},
							data: {
								Name: item.Name,
							},
						});
					}
				});
			const UpdatedDeveloper = await prisma.developer.update({
				where: { id: id },
				data: {
					ViewTag: data?.ViewTag,
					ActiveStatus: data?.ActiveStatus,
					Image: data?.Image,
				},
				include: {
					Image: true,
					Developer_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});

			return UpdatedDeveloper;
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
const DeleteDeveloper = async (req, res) => {
	try {
		const id = req.params.id;
		const Developer = await prisma.developer.findFirst({
			where: { id: id },
			include: {
				Image: true,
				Developer_Translation: {
					include: {
						Language: true,
					},
				},
				Property: true,
			},
		});
		if (!Developer) {
			return res.status(404).send("Developer Does not Exist!");
		}
		const imageURL = Developer.Image?.URL;
		const imageID = Developer.Image?.id;
		// const UserID = Address.Users?.id;
		let isImageDeleted = false;
		if (imageID !== undefined) {
			console.log(imageURL);
			if (fs.existsSync(`${imageURL}`)) {
				fs.unlinkSync(`${imageURL}`);
				isImageDeleted = true;
			} else {
				isImageDeleted = true;
			}
		} else {
			if (Developer.Developer_Translation.length > 0) {
				await prisma.developer_Translation.deleteMany({
					where: { developerID: id },
				});
			}
			await prisma.developer.delete({ where: { id: Developer.id } });
		}
		if (isImageDeleted) {
			if (Developer.Developer_Translation.length > 0) {
				await prisma.developer_Translation.deleteMany({
					where: { developerID: id },
				});
			}

			await prisma.developer.delete({ where: { id: Developer.id } });
			console.log("Deleting ...");
			await prisma.images.delete({ where: { id: imageID } });
		}
		// console.log("Role: ", Role);
		res.status(200).json({
			"Image Deleted: ": imageURL,
			Developer,
		});
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
	CreateDeveloper,
	GetAllDevelopers,
	GetDeveloperByID,
	GetAllActiveDevelopers,
	GetAllActiveViewDevelopers,
	UpdateDeveloper,
	DeleteDeveloper,
};
