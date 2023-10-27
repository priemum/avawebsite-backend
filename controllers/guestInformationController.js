const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
const requestIP = require("request-ip");
const IP = require("ip");
require("dotenv").config;

const CreateGuest = async (req, res) => {
	try {
		const data = req.body;
		const Guest = await prisma.guestInformation.create({
			data: data,
			include: {
				ListWithUs: true,
				Feedback: true,
				EnquiryForm: true,
				Applicantion: true,
			},
		});
		if (!Guest) {
			return res.status(400).send("Something Went Wrong!");
		}
		return res.status(201).send(Guest);
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
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Guests, count] = await prisma.$transaction([
			prisma.guestInformation.findMany({
				skip: offset || undefined,
				take: limit || undefined,
			}),
			prisma.guestInformation.count(),
		]);
		if (!Guests) {
			return res.status(404).send("No Guests Were Found!");
		}
		res.status(200).json({
			count,
			Guests,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetGuestByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Guest = await prisma.guestInformation.findUnique({
			where: { id: id },
		});
		if (!Guest) {
			return res.status(404).send("No Guest Were Found!");
		}
		res.status(200).send(Guest);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteGuest = async (req, res) => {
	try {
		const id = req.params.id;
		const Guest = await prisma.guestInformation.delete({
			where: { id: id },
		});
		if (!Guest) {
			return res.status(404).send("Guest Does not Exist!");
		}
		res.status(200).send(Guest);
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
	DeleteGuest,
};
