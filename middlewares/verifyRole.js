const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config;

const VerifyRole = async (req, res, next) => {
	try {
		const cookies = req.cookies;
		if (!cookies?.jwt) return res.status(204).send("No Cookie was found"); //No content
		const refreshToken = cookies.jwt;
		const foundUser = await prisma.users.findFirst({
			where: { refreshToken: refreshToken },
			include: {
				Role: {
					include: {
						Role_Resources: { include: { resource: true } },
					},
				},
			},
		});
		const RoleResources = await prisma.role_Resources.findMany({
			where: {
				roleID: foundUser.roleID,
			},
			include: {
				Role: true,
				resource: true,
			},
		});

		const path = req.url.split("/")[1];
		console.log("path: ", path);
		let pathAuth = "";
		RoleResources.map((item) => {
			if (item.resource.Name.toLowerCase() === path) pathAuth = item;
		});

		switch (req.method) {
			case "GET": {
				if (!pathAuth.Read) {
					return res
						.status(401)
						.send("You Don't Have Permission for this action!");
				}
				break;
			}
			case "POST": {
				if (!pathAuth.Create) {
					return res
						.status(401)
						.send("You Don't Have Permission for this action!");
				}
				break;
			}
			case "PUT": {
				if (!pathAuth.Update) {
					return res
						.status(401)
						.send("You Don't Have Permission for this action!");
				}
				break;
			}
			case "DELETE": {
				if (!pathAuth.Delete) {
					return res
						.status(401)
						.send("You Don't Have Permission for this action!");
				}
				break;
			}
			default: {
				return res.status(401).send("UnAuthorized Action!");
			}
		}
		next();
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

module.exports = VerifyRole;
