const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;
const requestIp = require("request-ip");
const net = require("net");

const CreateGuest = async (req, res) => {
	try {
		const data = req.body;
		const IP = req.ip;
		console.log(IP);
		// const Guest = await prisma.guestInformation.create({
		// 	data: data,
		// });
		// if (!Guest) {
		// 	return res.status(400).send("Something Went Wrong!");
		// }
		return res.status(201).send(data);
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

const GetAllGuests = async (req, res) => {
	try {
		const IP = requestIp.getClientIp(req);
		console.log(IP);
		console.log(net.isIP(IP));
		// const [Unit, count] = await prisma.$transaction([
		// 	prisma.unit.findMany({
		// 		include: {
		// 			Unit_Translation: {
		// 				include: { Language: true },
		// 			},
		// 		},
		// 	}),
		// 	prisma.currency.count(),
		// ]);

		// if (!Unit) {
		// 	return res.status(404).send("No Units Were Found!");
		// }
		// res.status(200).json({
		// 	count,
		// 	Unit,
		// });
		return res.status(200).send("Guest " + IP);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveGuests = async (req, res) => {
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
			prisma.currency.count({ where: { ActiveStatus: true } }),
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

const GetGuestByID = async (req, res) => {
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

const DeleteGuest = async (req, res) => {
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
	CreateGuest,
	GetAllGuests,
	GetGuestByID,
	GetAllActiveGuests,
	DeleteGuest,
};
