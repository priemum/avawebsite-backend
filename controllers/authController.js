const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config;

// Login
const Login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "User Name and Password are Required!" });
		}
		let user = await prisma.users.findUnique({
			where: { Email: email },
			include: { Role: true },
		});
		if (user !== null) {
			const isSame = await bcrypt.compare(password, user.Password);
			//if password is the same
			//generate token with the user's id and the secretKey in the env file
			if (isSame) {
				const accessToken = jwt.sign(
					{ userInfo: { email: user.Email } },
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: "30s",
					},
				);
				const refreshToken = jwt.sign(
					{ email: user.Email },
					process.env.REFERSH_TOKEN_SECRET,
					{
						expiresIn: "1d",
					},
				);
				let userData = {
					Email: user.Email,
					RoleID: user.Role.ID,
					RoleName: user.Role.Name,
				};
				user = await prisma.users.update({
					where: { ID: user.ID },
					data: { refreshToken: refreshToken },
					include: {
						Role: {
							include: {
								Role_Resources: { include: { resource: true } },
							},
						},
						Team: true,
						Image: true,
					},
				});
				res.cookie("jwt", refreshToken, {
					maxAge: 24 * 60 * 60 * 1000,
					httpOnly: true,
					sameSite: "None",
					secure: true,
				});
				res.cookie("UserData", userData, {
					maxAge: 24 * 60 * 60 * 1000,
					httpOnly: true,
					sameSite: "None",
					secure: true,
				});
				//send user data
				return res.status(201).send({ accessToken, user });
			} else {
				return res.status(401).send("Wrong Email or Password!");
			}
		} else {
			return res.status(401).send("User Does not exist!");
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const handleLogout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(204).send("No Cookie was found"); //No content
	const refreshToken = cookies.jwt;
	// Is refreshToken in db?
	const foundUser = await prisma.users.findFirst({
		where: { refreshToken: refreshToken },
	});
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
		res.clearCookie("UserData", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});
		return res.status(204).send("cookie cleared");
	}

	// Delete refreshToken in db

	await prisma.users.update({
		where: { ID: foundUser.ID },
		data: {
			refreshToken: null,
		},
	});
	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.clearCookie("UserData", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});
	res.status(200).json("Logged out Successfully!");
};

const VerifyRole = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies?.jwt) return res.status(204).send("No Cookie was found"); //No content
		const refreshToken = cookies.jwt;
	} catch (error) {}
};

module.exports = {
	Login,
	handleLogout,
};
