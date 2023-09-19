const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
require("dotenv").config;
//! not done reached to checking the Lnaguages array
const CreateArticle = async (req, res) => {
	try {
		const {
			MinRead,
			ActiveStatus,
			Title,
			Description,
			Caption,
			LanguageID,
			AuthorID,
		} = req.body;
		const image = req.file;
		if (!Title || !Description || !Caption || !MinRead) {
			return res
				.status(400)
				.send(
					"Missing information!! Title, Description, Caption and MinRead are requrired",
				);
		}
		const Results = await prisma.$transaction(async (prisma) => {
			let Msg = "";
			let Code = 201;
			let Language = "";
			LanguageID.map(async (lang) => {
				Language = await prisma.languages.findUnique({
					where: {
						id: lang,
					},
				});
				// console.log(Language);
				if (!Language) {
					console.log("Test: ", Language);
					Msg = "Language must be selected!";
					Code = 400;
					return { Msg, Code };
				}
			});

			const Author = await prisma.users.findUnique({
				where: {
					id: AuthorID,
				},
			});
			if (!Author) {
				Msg = "Author must be selected!";
				Code = 400;
				return { Msg, Code };
			}
			// const Article = await prisma.articles.create({
			// 	data: {
			// 		MinRead: parseInt(MinRead),
			// 		ActiveStatus,
			// 		Image: image
			// 			? {
			// 					create: {
			// 						URL: `/public/images/article/${
			// 							Math.floor(new Date().getTime() / 1000) +
			// 							"-" +
			// 							image?.originalname
			// 						}`,
			// 						Alt: image?.originalname,
			// 						Size: image.size,
			// 						Type: image.mimetype,
			// 						user: undefined,
			// 					},
			// 			  }
			// 			: undefined,
			// 		// Articles_Translation: {
			// 		// 	create: {
			// 		// 		Caption,
			// 		// 		Description,
			// 		// 		Title,
			// 		// 		Language: {
			// 		// 			connect: {
			// 		// 				id: LanguageID,
			// 		// 			},
			// 		// 		},
			// 		// 	},
			// 		// },
			// 		User: {
			// 			connect: {
			// 				id: AuthorID,
			// 			},
			// 		},
			// 	},
			// });

			return "Article";
		});
		console.log(Results);
		if (Results.Code === 400) {
			return res.status(400).send(Results.Msg);
		}
		return res.status(201).send(Results);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllArticles = async (req, res) => {
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

const GetAllActiveArticles = async (req, res) => {
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

const GetArticleByID = async (req, res) => {
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
const UpdateArticle = async (req, res) => {
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
					URL: `/public/images/team/${
						Math.floor(new Date().getTime() / 1000) + "-" + image?.originalname
					}`,

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

const DeleteArticle = async (req, res) => {
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
	CreateArticle,
	GetAllArticles,
	GetArticleByID,
	GetAllActiveArticles,
	UpdateArticle,
	DeleteArticle,
};
