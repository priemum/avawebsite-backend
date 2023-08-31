const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
require("dotenv").config;

const CreateRole = async (req, res) => {
	try {
		const { Name, ActiveStatus } = req.body;
		if (!Name) {
			return res.status(400).send("Role Name is Missing!!");
		}
		const Role = await prisma.role.create({
			data: {
				Name,
				ActiveStatus,
			},
		});
		if (Role) {
			return res.status(201).send(Role);
		} else {
			return res.status(409).send("Details are not correct");
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllRoles = async (req, res) => {
	try {
		const Roles = await prisma.role.findMany({});
		if (!Roles) {
			return res.status(404).send("No Roles Were Found!");
		}
		res.status(200).send(Roles);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveRoles = async (req, res) => {
	try {
		const Roles = await prisma.role.findMany({
			where: { ActiveStatus: true },
		});
		if (!Roles) {
			return res.status(404).send("No Roles Were Found!");
		}
		res.status(200).send(Roles);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetRoleByID = async (req, res) => {
	try {
		const id = req.params.id;
		const Roles = await prisma.role.findUnique({
			where: { ID: id },
		});
		if (!Roles) {
			return res.status(404).send("No Roles Were Found!");
		}
		res.status(200).send(Roles);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateRole = async (req, res) => {
	try {
		const id = req.params.id;

		const Roles = await prisma.role.findUnique({
			where: { ID: id },
		});
		if (!Roles) {
			return res.status(404).send("No Roles Were Found!");
		}
		res.status(200).send(Roles);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

module.exports = {
	CreateRole,
	GetAllRoles,
	GetRoleByID,
	GetAllActiveRoles,
	UpdateRole,
};
