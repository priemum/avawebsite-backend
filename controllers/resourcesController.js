const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
require("dotenv").config;

const CreateResource = async (req, res) => {
	try {
		const { Name, Description, ActiveStatus } = req.body;
		if (!Name) {
			return res.status(400).send("Role Name is Missing!!");
		}
		const Resource = await prisma.resources.create({
			data: {
				Name,
				ActiveStatus,
				Description,
			},
		});
		if (Resource) {
			return res.status(201).send(Resource);
		} else {
			return res.status(409).send("Details are not correct");
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllResources = async (req, res) => {
	try {
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const Resources = await prisma.resources.findMany({
			skip: skip || undefined,
			take: take || undefined,
		});
		if (!Resources) {
			return res.status(404).send("No Resource Were Found!");
		}
		res.status(200).send(Resources);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveResources = async (req, res) => {
	try {
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const Resources = await prisma.resources.findMany({
			where: { ActiveStatus: true },
			skip: skip || undefined,
			take: take || undefined,
		});
		if (!Resources) {
			return res.status(404).send("No Resources Were Found!");
		}
		res.status(200).send(Resources);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetResourceByID = async (req, res) => {
	try {
		const id = req.params.id;
		const Resource = await prisma.resources.findUnique({
			where: { id: id },
		});
		if (!Resource) {
			return res.status(404).send("No Resource Were Found!");
		}
		res.status(200).send(Resource);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateResource = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const Resource = await prisma.resources.findUnique({
			where: { id: id },
		});
		if (!Resource) {
			return res.status(404).send("No Resource Were Found!");
		}
		updates.forEach((update) => (Resource[update] = req.body[update]));
		await prisma.resources.update({
			where: { id: id },
			data: Resource,
		});
		res.status(200).send(Resource);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteResource = async (req, res) => {
	try {
		const id = req.params.id;
		const Resource = await prisma.resources.delete({
			where: { id: id },
		});

		// console.log("Role: ", Role);
		res.status(200).send(Resource);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			}
		}
		console.log(error);
		return res.status(500).send(error.message);
	}
};

module.exports = {
	CreateResource,
	GetAllActiveResources,
	GetAllResources,
	GetResourceByID,
	UpdateResource,
	DeleteResource,
};
