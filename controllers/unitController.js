const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateUnit = async (req, res) => {
	try {
		const data = req.body;
		data.conversionRate = parseFloat(data.conversionRate);
		if (data.ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		const Unit = await prisma.unit.create({
			data: {
				conversionRate: data.conversionRate,
				ActiveStatus: data?.ActiveStatus,
				Unit_Translation: {
					createMany: {
						data: data.Unit_Translation,
					},
				},
			},
			include: {
				Unit_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Unit);
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

const GetAllUnits = async (req, res) => {
	try {
		const [Unit, count] = await prisma.$transaction([
			prisma.unit.findMany({
				include: {
					Unit_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.unit.count(),
		]);

		if (!Unit) {
			return res.status(404).send("No Units Were Found!");
		}
		res.status(200).json({
			count,
			Unit,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveUnits = async (req, res) => {
	try {
		const [Unit, count] = await prisma.$transaction([
			prisma.unit.findMany({
				where: { ActiveStatus: true },
				include: {
					Unit_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.unit.count({ where: { ActiveStatus: true } }),
		]);
		if (!Unit) {
			return res.status(404).send("No Units Were Found!");
		}
		res.status(200).json({
			count,
			Unit,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetUnitByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Unit = await prisma.unit.findUnique({
			where: { id: id },
			include: {
				Unit_Translation: {
					include: { Language: true },
				},
			},
		});
		if (!Unit) {
			return res.status(404).send("No Units Were Found!");
		}
		res.status(200).send(Unit);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateUnit = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
		const data = await prisma.unit.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Unit was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		data.conversionRate = parseFloat(data.conversionRate);
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		const result = await prisma.$transaction(async (prisma) => {
			data.Unit_Translation &&
				data.Unit_Translation.map(async (item) => {
					{
						await prisma.unit_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { unitID: id }],
							},
							data: {
								Name: item.Name,
							},
						});
					}
				});
			const UpdatedUnit = await prisma.unit.update({
				where: { id: id },
				data: {
					conversionRate: data?.conversionRate || undefined,
					ActiveStatus: data?.ActiveStatus,
				},
				include: {
					Unit_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});

			return UpdatedUnit;
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
const DeleteUnit = async (req, res) => {
	try {
		const id = req.params.id;
		const Unit = await prisma.unit.findFirst({
			where: { id: id },
			include: {
				Unit_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Unit) {
			return res.status(404).send("Unit Does not Exist!");
		}

		if (Unit.Unit_Translation.length > 0) {
			await prisma.unit_Translation.deleteMany({
				where: { unitID: id },
			});
		}
		await prisma.unit.delete({ where: { id: Unit.id } });
		// console.log("Role: ", Role);
		res.status(200).send(Unit);
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
	CreateUnit,
	GetAllUnits,
	GetUnitByID,
	GetAllActiveUnits,
	UpdateUnit,
	DeleteUnit,
};
