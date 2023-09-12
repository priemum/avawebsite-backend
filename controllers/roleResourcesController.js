const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
require("dotenv").config;

const CreateRoleResource = async (req, res) => {
	try {
		const { RoleID, ResourceID, Read, Create, Update, Delete } = req.body;
		const RoleResource = await prisma.role_Resources.create({
			data: {
				roleID: RoleID,
				resourcesID: ResourceID,
				Read: Read ? Read : false,
				Create: Create ? Create : false,
				Update: Update ? Update : false,
				Delete: Delete ? Delete : false,
			},
			include: { Role: true, resource: true },
		});
		if (RoleResource) {
			return res.status(201).send(RoleResource);
		} else {
			return res.status(409).send("Details are not correct");
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllRolesResource = async (req, res) => {
	try {
		const RolesResource = await prisma.role_Resources.findMany({
			include: { Role: true, resource: true },
		});
		if (!RolesResource) {
			return res.status(404).send("No Roles Resources Were Found!");
		}
		res.status(200).send(RolesResource);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetRoleResourceByID = async (req, res) => {
	try {
		const id = req.params.id;
		const RolesResource = await prisma.role_Resources.findUnique({
			where: { ID: id },
			include: { Role: true, resource: true },
		});
		if (!RolesResource) {
			return res.status(404).send("No Roles Resources Were Found!");
		}
		res.status(200).send(RolesResource);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
//Get Role Resources by Role ID
const GetRoleResourceByRoleID = async (req, res) => {
	try {
		const id = req.params.id;
		const RolesResource = await prisma.role_Resources.findMany({
			where: { roleID: id },
			include: { Role: true, resource: true },
		});
		if (!RolesResource) {
			return res.status(404).send("No Roles Resources Were Found!");
		}
		res.status(200).send(RolesResource);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateRoleResource = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const Selected = { ID: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
		const RolesResource = await prisma.role_Resources.findUnique({
			where: { ID: id },
			select: Selected,
		});
		if (!RolesResource) {
			return res.status(404).send("No Roles Resources Were Found!");
		}
		updates.forEach((update) => (RolesResource[update] = req.body[update]));
		await prisma.role_Resources.update({
			where: { ID: id },
			data: RolesResource,
		});
		res.status(200).json({
			Message: "Updated successfully",
			RolesResource,
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.log(error.code);
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			}
		}
		return res.status(500).send(error.message);
	}
};

const DeleteRoleResource = async (req, res) => {
	try {
		const id = req.params.id;
		const RolesResource = await prisma.role_Resources.delete({
			where: { ID: id },
			include: { Role: true, resource: true },
		});

		// console.log("Role: ", Role);
		res.status(200).send(RolesResource);
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
	CreateRoleResource,
	GetAllRolesResource,
	GetRoleResourceByID,
	GetRoleResourceByRoleID,
	UpdateRoleResource,
	DeleteRoleResource,
};
