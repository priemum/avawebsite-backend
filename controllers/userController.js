const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const fs = require("fs");
require("dotenv").config;

//Create New User
const Register = async (req, res) => {
	try {
		const {
			Name,
			Email,
			Password,
			PhoneNo,
			ActiveStatus,
			Gender,
			DOB,
			RoleID,
		} = req.body;
		const image = req.file;
		if (!Name || !Email || !Password) {
			return res.status(400).send("Required Field Missing!!");
		}
		const user = await prisma.users.create({
			data: {
				Name,
				Email,
				Password: await bcrypt.hash(Password, 10),
				ActiveStatus,
				Gender,
				DOB,
				PhoneNo,
				Role: RoleID
					? {
							connect: {
								ID: RoleID,
							},
					  }
					: undefined,
				Image: image
					? {
							create: {
								URL: `/public/images/users/${
									Math.floor(new Date().getTime() / 1000) +
									"-" +
									image?.originalname
								}`,
								Alt: image?.originalname,
								Size: image.size,
								Type: image.mimetype,
							},
					  }
					: undefined,
			},
			include: { Role: true, Image: true },
		});
		if (user) {
			return res.status(201).send(user);
		} else {
			return res.status(409).send("Details are not correct");
		}
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const GetAllUsers = async (req, res) => {
	try {
		const [Users, count] = await prisma.$transaction([
			prisma.users.findMany({
				include: { Role: true, Team: true, Image: true },
			}),
			prisma.users.count(),
		]);

		if (!Users) {
			return res.status(404).send("No users were found!");
		}
		res.status(200).json({
			count,
			Users,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const GetAllActiveUsers = async (req, res) => {
	try {
		const query = {
			where: {
				ActiveStatus: true,
			},
		};
		const [Users, count] = await prisma.$transaction([
			prisma.users.findMany({
				where: { ActiveStatus: true },
				include: { Role: true, Team: true, Image: true },
			}),
			prisma.users.count(query),
		]);

		if (!Users) {
			return res.status(404).send("No users were found!");
		}
		res.status(200).json({
			count,
			Users,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};
const GetUserByID = async (req, res) => {
	try {
		const query = {
			where: {
				ID: req.params.id,
			},
			include: { Role: true, Team: true, Image: true },
		};
		const user = await prisma.users.findUnique(query);

		if (!user) {
			return res.status(404).send("No users were found!");
		}
		res.status(200).json({
			user,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const UpdateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = {};

		updates.forEach((item) => {
			Selected[item] = true;
		});
		if (image) {
			Selected["Image"] = true;
		}
		const User = await prisma.users.findUnique({
			where: { ID: id },
			select: Selected,
		});
		if (!User) {
			return res.status(404).send("User was not Found!");
		}
		updates.forEach((update) => (User[update] = req.body[update]));
		if (image) {
			if (User.Image !== null) {
				if (fs.existsSync(`.${User.Image.URL}`)) {
					console.log(`.${User.Image.URL}`);
					fs.unlinkSync(`.${User.Image.URL}`);
				}
				await prisma.images.delete({ where: { ID: User.Image.ID } });
			}
			User.Image = {
				create: {
					URL: `/public/images/users/${
						Math.floor(new Date().getTime() / 1000) + "-" + image?.originalname
					}`,

					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					teamID: undefined,
				},
			};
		}
		await prisma.users.update({
			where: { ID: id },
			data: User,
		});
		res.status(200).send(User);
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

const DeleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const User = await prisma.users.delete({
			where: { ID: id },
		});
		res.status(200).send(User);
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
	Register,
	GetAllUsers,
	GetAllActiveUsers,
	GetUserByID,
	UpdateUser,
	DeleteUser,
};
