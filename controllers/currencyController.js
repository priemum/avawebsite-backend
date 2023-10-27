const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateCurrency = async (req, res) => {
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
		const Currency = await prisma.currency.create({
			data: {
				conversionRate: data.conversionRate,
				ActiveStatus: data?.ActiveStatus,
				Currency_Translation: {
					createMany: {
						data: data.Currency_Translation,
					},
				},
			},
			include: {
				Currency_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Currency);
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

const GetAllCurrencies = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Currency, count] = await prisma.$transaction([
			prisma.currency.findMany({
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Currency_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.currency.count(),
		]);

		if (!Currency) {
			return res.status(404).send("No Currency Were Found!");
		}
		res.status(200).json({
			count,
			Currency,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveCurrencies = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Currency, count] = await prisma.$transaction([
			prisma.currency.findMany({
				where: { ActiveStatus: true },
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Currency_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.currency.count({ where: { ActiveStatus: true } }),
		]);
		if (!Currency) {
			return res.status(404).send("No Currency Were Found!");
		}
		res.status(200).json({
			count,
			Currency,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetCurrencyByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Currency = await prisma.currency.findUnique({
			where: { id: id },
			include: {
				Currency_Translation: {
					include: { Language: true },
				},
			},
		});
		if (!Currency) {
			return res.status(404).send("No Currencies Were Found!");
		}
		res.status(200).send(Currency);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateCurrency = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
		const data = await prisma.currency.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Currency was not Found!");
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
			data.Currency_Translation &&
				data.Currency_Translation.map(async (item) => {
					{
						await prisma.currency_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { currencyID: id }],
							},
							data: {
								Name: item.Name,
							},
						});
					}
				});
			const UpdatedCurrency = await prisma.currency.update({
				where: { id: id },
				data: {
					conversionRate: data?.conversionRate || undefined,
					ActiveStatus: data?.ActiveStatus,
				},
				include: {
					Currency_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});

			return UpdatedCurrency;
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
const DeleteCurrency = async (req, res) => {
	try {
		const id = req.params.id;
		const Currency = await prisma.currency.findFirst({
			where: { id: id },
			include: {
				Currency_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Currency) {
			return res.status(404).send("Currency Does not Exist!");
		}

		if (Currency.Currency_Translation.length > 0) {
			await prisma.currency_Translation.deleteMany({
				where: { currencyID: id },
			});
		}
		await prisma.currency.delete({ where: { id: Currency.id } });
		// console.log("Role: ", Role);
		res.status(200).send(Currency);
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
	CreateCurrency,
	GetAllCurrencies,
	GetCurrencyByID,
	GetAllActiveCurrencies,
	UpdateCurrency,
	DeleteCurrency,
};
