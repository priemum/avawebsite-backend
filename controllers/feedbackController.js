const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateFeedback = async (req, res) => {
	try {
		const data = req.body;
		const Feedback = await prisma.feedback.create({
			data: {
				Message: data.Message,
				Subject: data.Subject,
				Guest: {
					connectOrCreate: {
						where: {
							Email: data.Email,
						},
						create: {
							Email: data.Email,
							FullName: data.FullName,
							Gender: data.Gender,
							IPAddress: data.IPAddress,
							PhoneNo: data.PhoneNo,
						},
					},
				},
			},
		});
		if (!Feedback) {
			return res.status(400).send("Something Went Wrong!");
		}
		return res.status(201).send(Feedback);
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

const GetAllFeedbacks = async (req, res) => {
	try {
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const [Feedback, count] = await prisma.$transaction([
			prisma.feedback.findMany({
				skip: skip || undefined,
				take: take || undefined,
				include: {
					Guest: true,
				},
			}),
			prisma.feedback.count(),
		]);

		if (!Feedback) {
			return res.status(404).send("No Feedback Were Found!");
		}
		res.status(200).json({
			count,
			Feedback,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetFeedbackByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Feedback = await prisma.feedback.findUnique({
			where: { id: id },
			include: {
				Guest: true,
			},
		});
		if (!Feedback) {
			return res.status(404).send("No Feedback Were Found!");
		}
		res.status(200).send(Feedback);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Get Feedback by Guest Email

const GetFeedbacksByGuestEmail = async (req, res) => {
	try {
		const email = req.params.email;
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const Feedback = await prisma.feedback.findMany({
			where: {
				Guest: {
					Email: email,
				},
			},
			skip: skip || undefined,
			take: take || undefined,
			include: {
				Guest: true,
			},
		});
		if (!Feedback) {
			return res.status(404).send("No Feedback Were Found for this Email!");
		}
		res.status(200).send(Feedback);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteFeedback = async (req, res) => {
	try {
		const id = req.params.id;
		const Feedback = await prisma.feedback.delete({
			where: { id: id },
		});
		if (!Feedback) {
			return res.status(404).send("Feedback Does not Exist!");
		}
		res.status(200).send(Feedback);
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
	CreateFeedback,
	GetAllFeedbacks,
	GetFeedbackByID,
	GetFeedbacksByGuestEmail,
	DeleteFeedback,
};
