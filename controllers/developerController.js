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
			},
			include: {
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
		const [Developer, count] = await prisma.$transaction([
			prisma.developer.findMany({
				include: {
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
		const [Developer, count] = await prisma.$transaction([
			prisma.developer.findMany({
				where: { ActiveStatus: true },
				include: {
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
		const [Developer, count] = await prisma.$transaction([
			prisma.developer.findMany({
				where: { AND: [{ ActiveStatus: true }, { ViewTag: true }] },
				include: {
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
		const Selected = { id: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
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
					ViewTag: data?.ViewTag || undefined,
					ActiveStatus: data?.ActiveStatus,
				},
				include: {
					Developer_Translation: {
						include: {
							Language: true,
						},
					},
					Property: true,
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

		if (Developer.Developer_Translation.length > 0) {
			await prisma.developer_Translation.deleteMany({
				where: { developerID: id },
			});
		}
		await prisma.developer.delete({ where: { id: Developer.id } });
		// console.log("Role: ", Role);
		res.status(200).send(Developer);
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
