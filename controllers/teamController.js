const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
require("dotenv").config;

const CreateTeam = async (req, res) => {
	try {
		let { Title, Description, ViewTag, ActiveStatus, UserID } = req.body;
		const image = req.file;
		if (!Title) {
			return res.status(400).send("Team Title or Description is Missing!!");
		}
		if (ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				ActiveStatus = false;
			} else {
				ActiveStatus = true;
			}
		}
		if (ViewTag) {
			if (req.body.ViewTag.toLowerCase() === "false") {
				ViewTag = false;
			} else {
				ViewTag = true;
			}
		}
		const Team = await prisma.team.create({
			data: {
				Title,
				Description,
				ActiveStatus,
				ViewTag,
				Image: image
					? {
							create: {
								URL: image.path,
								Alt: image?.originalname,
								Size: image.size,
								Type: image.mimetype,
								user: undefined,
							},
					  }
					: undefined,
			},
			include: { Users: true, Image: true },
		});
		if (Team) {
			return res.status(201).send(Team);
		} else {
			return res.status(409).send("Details are not correct");
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllTeams = async (req, res) => {
	try {
		const [Teams, count] = await prisma.$transaction([
			prisma.team.findMany({
				include: { Users: true, Image: true },
			}),
			prisma.team.count(),
		]);

		if (!Teams) {
			return res.status(404).send("No Teams Were Found!");
		}
		res.status(200).json({
			count,
			Teams,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveTeams = async (req, res) => {
	try {
		const [Teams, count] = await prisma.$transaction([
			prisma.team.findMany({
				where: { ActiveStatus: true },
				include: { Users: true, Image: true },
			}),
			prisma.team.count({ where: { ActiveStatus: true } }),
		]);
		if (!Teams) {
			return res.status(404).send("No Teams Were Found!");
		}
		res.status(200).json({
			count,
			Teams,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// Get All active viewable teams
const GetAllActiveViewTeams = async (req, res) => {
	try {
		const [Teams, count] = await prisma.$transaction([
			prisma.team.findMany({
				where: { AND: [{ ActiveStatus: true }, { ViewTag: true }] },
				include: { Users: true, Image: true },
			}),
			prisma.team.count({
				where: { AND: [{ ActiveStatus: true }, { ViewTag: true }] },
			}),
		]);
		if (!Teams) {
			return res.status(404).send("No Teams Were Found!");
		}
		res.status(200).json({
			count,
			Teams,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetTeamByID = async (req, res) => {
	try {
		const id = req.params.id;
		const Team = await prisma.team.findUnique({
			where: { id: id },
			include: { Users: true, Image: true },
		});
		if (!Team) {
			return res.status(404).send("No Team Were Found!");
		}
		res.status(200).send(Team);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO: Fix update image to match user update
const UpdateTeam = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };
		updates.forEach((item) => {
			Selected[item] = true;
		});
		if (image) {
			Selected["Image"] = true;
		}
		const Team = await prisma.team.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!Team) {
			return res.status(404).send("No Team Were Found!");
		}
		updates.forEach((update) => (Team[update] = req.body[update]));
		if (image) {
			if (Team.Image !== null) {
				if (fs.existsSync(`.${Team.Image.URL}`)) {
					console.log(`.${Team.Image.URL}`);
					fs.unlinkSync(`.${Team.Image.URL}`);
				}
				await prisma.images.delete({ where: { id: Team.Image.id } });
			}
			Team.Image = {
				create: {
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					user: undefined,
				},
			};
		}
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				Team.ActiveStatus = false;
			} else {
				Team.ActiveStatus = true;
			}
		}
		console.log(Team);
		if (updates.includes("ViewTag")) {
			if (req.body.ViewTag.toLowerCase() === "false") {
				Team.ViewTag = false;
				console.log(Team.ViewTag);
			} else {
				Team.ViewTag = true;
			}
		}
		await prisma.team.update({
			where: { id: id },
			data: Team,
		});
		res.status(200).json({
			Message: "Updated successfully",
			Team,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteTeam = async (req, res) => {
	try {
		const id = req.params.id;
		const Team = await prisma.team.findFirst({
			where: { id: id },
			include: { Users: true, Image: true },
		});
		const imageURL = Team.Image?.URL;
		const imageID = Team.Image?.id;
		const UserID = Team.Users?.id;
		let isImageDeleted = false;
		if (imageID !== undefined) {
			if (fs.existsSync(`.${imageURL}`)) {
				fs.unlinkSync(`.${imageURL}`);
				isImageDeleted = true;
			} else {
				isImageDeleted = true;
			}
		} else {
			await prisma.team.delete({ where: { id: Team.id } });
		}
		if (isImageDeleted) {
			console.log("Deleting ...");
			await prisma.images.delete({ where: { id: imageID } });
			await prisma.team.delete({ where: { id: Team.id } });
		}
		// console.log("Role: ", Role);
		res.status(200).json({
			"Image Deleted: ": imageURL,
			Team,
		});
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
	CreateTeam,
	GetAllTeams,
	GetTeamByID,
	GetAllActiveTeams,
	GetAllActiveViewTeams,
	UpdateTeam,
	DeleteTeam,
};
