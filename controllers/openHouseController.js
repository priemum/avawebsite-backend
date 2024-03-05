const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateAppointment = async (req, res) => {
	try {
		const data = req.body;
		const Appointment = await prisma.openHouse.create({
			data: {
				Email: data.Email,
				FullName: data.FullName,
				Agent: data.Agent,
				PhoneNo: data.PhoneNo,
			},
		});
		return res.status(201).send(Appointment);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			} else if (error.code === "P2002") {
				return res.status(404).send("Email Already Exist!");
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

const GetAllAppointments = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Appointments, count] = await prisma.$transaction([
			prisma.openHouse.findMany({
				skip: offset || undefined,
				take: limit || undefined,
			}),
			prisma.openHouse.count(),
		]);

		if (!Appointments) {
			return res.status(404).send("No Data Were Found!");
		}
		res.status(200).json({
			count,
			Appointments,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAppointmentByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Appointment = await prisma.openHouse.findUnique({
			where: { id: id },
		});
		if (!Appointment) {
			return res.status(404).send("No Data Were Found!");
		}
		res.status(200).send(Appointment);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteAppointment = async (req, res) => {
	try {
		const id = req.params.id;
		const Appointment = await prisma.openHouse.delete({
			where: { id: id },
		});
		// console.log("Role: ", Role);
		res.status(200).send(Appointment);
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
	CreateAppointment,
	GetAllAppointments,
	GetAppointmentByID,
	DeleteAppointment,
};
