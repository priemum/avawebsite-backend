const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
require("dotenv").config;

const CreateLanguage = async (req, res) => {
	try {
		const { Name, Code } = req.body;
		if (!Name) {
			return res.status(400).send("Language Name is Missing!!");
		}

		const Language = await prisma.languages.create({
			data: {
				Name,
				Code,
			},
		});

		if (Language) {
			return res.status(201).send(Language);
		} else {
			return res.status(409).send("Details are not correct");
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllLanguages = async (req, res) => {
	try {
		const Languages = await prisma.languages.findMany({});
		if (!Languages) {
			return res.status(404).send("No Languages Were Found!");
		}
		res.status(200).send(Languages);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetLanguageByID = async (req, res) => {
	try {
		const id = req.params.id;
		const Language = await prisma.languages.findUnique({
			where: { id: id },
		});
		if (!Language) {
			return res.status(404).send("No Language Were Found!");
		}
		res.status(200).send(Language);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateLanguage = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const Language = await prisma.languages.findUnique({
			where: { id: id },
		});
		if (!Language) {
			return res.status(404).send("No Language Were Found!");
		}
		updates.forEach((update) => (Language[update] = req.body[update]));
		await prisma.languages.update({
			where: { id: id },
			data: Language,
		});
		res.status(200).send(Language);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteLanguage = async (req, res) => {
	try {
		const id = req.params.id;
		const Language = await prisma.languages.delete({
			where: { id: id },
		});

		res.status(200).send(Language);
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
	CreateLanguage,
	GetAllLanguages,
	GetLanguageByID,
	UpdateLanguage,
	DeleteLanguage,
};
