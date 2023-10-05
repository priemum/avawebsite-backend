const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateEnquiryForm = async (req, res) => {
	try {
		const data = req.body;
		const EnquiryForm = await prisma.enquiryForm.create({
			data: {
				Type: data.Type,
				Purpose: data.Purpose,
				Bedrooms: parseInt(data.Bedrooms),
				PriceMin: parseFloat(data.PriceMin),
				PriceMax: parseFloat(data.PriceMax),
				Message: data.Message,
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
		if (!EnquiryForm) {
			return res.status(400).send("Something Went Wrong!");
		}
		return res.status(201).send(EnquiryForm);
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

const GetAllEnquiryForms = async (req, res) => {
	try {
		const [EnquiryForm, count] = await prisma.$transaction([
			prisma.enquiryForm.findMany({
				include: {
					Guest: true,
				},
			}),
			prisma.enquiryForm.count(),
		]);

		if (!EnquiryForm) {
			return res.status(404).send("No Enquiry Form Were Found!");
		}
		res.status(200).json({
			count,
			EnquiryForm,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetEnquiryFormByID = async (req, res) => {
	try {
		const id = req.params.id;

		const EnquiryForm = await prisma.enquiryForm.findUnique({
			where: { id: id },
			include: {
				Guest: true,
			},
		});
		if (!EnquiryForm) {
			return res.status(404).send("No Enquiry Form Were Found!");
		}
		res.status(200).send(EnquiryForm);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Get Feedback by Guest Email

const GetEnquiryFormsByGuestEmail = async (req, res) => {
	try {
		const email = req.params.email;

		const EnquiryForm = await prisma.enquiryForm.findMany({
			where: {
				Guest: {
					Email: email,
				},
			},
			include: {
				Guest: true,
			},
		});
		if (!EnquiryForm) {
			return res.status(404).send("No Enquiry Form Were Found for this Email!");
		}
		res.status(200).send(EnquiryForm);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteEnquiryForm = async (req, res) => {
	try {
		const id = req.params.id;
		const EnquiryForm = await prisma.enquiryForm.delete({
			where: { id: id },
		});
		if (!EnquiryForm) {
			return res.status(404).send("EnquiryForm Does not Exist!");
		}
		res.status(200).send(EnquiryForm);
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
	CreateEnquiryForm,
	GetAllEnquiryForms,
	GetEnquiryFormByID,
	GetEnquiryFormsByGuestEmail,
	DeleteEnquiryForm,
};
