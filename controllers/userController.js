const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
require("dotenv").config;

//Create New User
const Register = async (req, res) => {
	try {
		const { Name, Email, Password } = req.body;
		if (!Name || !Email || !Password) {
			return res.status(400).send("Required Field Missing!!");
		}
		const user = await prisma.users.create({
			data: {
				Name,
				Email,
				Password: await bcrypt.hash(Password, 10),
			},
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
module.exports = {
	Register,
};
