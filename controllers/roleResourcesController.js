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
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const RolesResource = await prisma.role_Resources.findMany({
			skip: skip || undefined,
			take: take || undefined,
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
			where: { id: id },
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
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const RolesResource = await prisma.role_Resources.findMany({
			where: { roleID: id },
			skip: skip || undefined,
			take: take || undefined,
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
		const Selected = { id: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
		const RolesResource = await prisma.role_Resources.findUnique({
			where: { id: id },
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

//Bulk update rolre resources by role ID

const UpdateRoleResourceByRoleID = async (req, res) => {
	try {
		const id = req.params.id;
		const data = req.body.Role_Resources;
		if (data.length === 0) {
			throw new Error("No Data Were Sent!");
		}
		const result = await prisma.$transaction(async (prisma) => {
			data.map(async (item) => {
				await prisma.role_Resources.update({
					where: {
						id: item.id,
					},
					data: {
						Create: item.Create,
						Update: item.Update,
						Delete: item.Delete,
						Read: item.Read,
					},
				});
			});
			const UpdatedRole = await prisma.role.findUnique({
				where: {
					id: id,
				},
				include: { Role_Resources: { include: { resource: true } } },
			});
			return { UpdatedRole };
		});
		return res.status(200).send(result);
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
			where: { id: id },
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
	UpdateRoleResourceByRoleID,
	DeleteRoleResource,
};
