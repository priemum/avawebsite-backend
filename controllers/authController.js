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
						expiresIn: "5m",
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
					RoleID: user.Role.id,
					RoleName: user.Role.Name,
				};
				user = await prisma.users.update({
					where: { id: user.id },
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
				});
				res.cookie("UserData", userData, {
					maxAge: 24 * 60 * 60 * 1000,
					httpOnly: true,
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

const GetProfile = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies.jwt) return res.status(401).send("User Does not exist!");
		const refreshToken = cookies.jwt;
		const foundUser = await prisma.users.findFirst({
			where: { refreshToken: refreshToken },
			include: {
				Articles: {
					include: {
						Articles_Translation: {
							include: {
								Language: true,
							},
						},
						Image: true,
					},
				},
				Image: true,
				Role: {
					include: {
						Role_Resources: {
							include: {
								resource: true,
							},
						},
					},
				},
				Address: {
					include: {
						Address_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Team: true,
			},
		});
		if (!foundUser) {
			return res.status(404).send("User Doesn't Exist!");
		}
		return res.status(200).send(foundUser);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// update Profile
const updateProfile = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies.jwt) return res.status(401).send("User Does not exist!");
		const refreshToken = cookies.jwt;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };

		updates.forEach((item) => {
			Selected[item] = true;
		});
		if (image) {
			Selected["Image"] = true;
		}
		const User = await prisma.users.findFirst({
			where: { refreshToken: refreshToken },
			select: Selected,
		});
		if (!User) {
			return res.status(404).send("User was not Found!");
		}
		updates.forEach((update) => (User[update] = req.body[update]));
		if (image) {
			if (User.Image !== null) {
				if (fs.existsSync(`${User.Image.URL}`)) {
					fs.unlinkSync(`${User.Image.URL}`);
				}
				await prisma.images.delete({ where: { id: User.Image.id } });
			}
			User.Image = {
				create: {
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					teamID: undefined,
				},
			};
		}
		if (updates.includes("Password")) {
			User.Password = await bcrypt.hash(User.Password, 10);
		}
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				User.ActiveStatus = false;
			} else {
				User.ActiveStatus = true;
			}
		}
		await prisma.users.update({
			where: { id: User.id },
			data: User,
		});
		res.status(200).json({
			Message: "Updated successfully",
			User,
		});
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
		//! added this option at production secure: true, sameSite: "None",
		res.clearCookie("jwt", { httpOnly: true });
		res.clearCookie("UserData", {
			httpOnly: true,
		});
		return res.status(204).send("cookie cleared");
	}

	// Delete refreshToken in db

	await prisma.users.update({
		where: { id: foundUser.id },
		data: {
			refreshToken: null,
		},
	});
	//! added this option at production secure: true, sameSite: "None",
	res.clearCookie("jwt", { httpOnly: true });
	res.clearCookie("UserData", {
		httpOnly: true,
	});
	res.status(200).json("Logged out Successfully!");
};

module.exports = {
	Login,
	handleLogout,
	GetProfile,
	updateProfile,
};
