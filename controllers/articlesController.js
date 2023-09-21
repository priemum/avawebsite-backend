const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
require("dotenv").config;

const CreateArticle = async (req, res) => {
	try {
		const image = req.file;
		// const data = [{}];
		const data = req.body;
		if (image) {
			data.Image = {
				create: {
					URL: `/public/images/article/${
						Math.floor(new Date().getTime() / 1000) + "-" + image?.originalname
					}`,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					user: undefined,
				},
			};
		}

		// data.ActiveStatus =
		data.MinRead = parseInt(data.MinRead);
		if (data.ActiveStatus) {
			data.ActiveStatus =
				data.ActiveStatus?.toLowerCase?.() === "true"
					? data.ActiveStatus?.toLowerCase?.() === "true"
					: false;
		}
		const Article = await prisma.articles.create({
			data: {
				MinRead: data.MinRead,
				ActiveStatus: data.ActiveStatus,
				Articles_Translation: {
					createMany: {
						data: data.Articles_Translation,
					},
				},
				Image: data?.Image,
				User: {
					connect: {
						id: data.AuthorID,
					},
				},
			},
			include: {
				Image: true,
				Articles_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Article);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			} else if (error.code === "P2002") {
				return res.status(404).send("Unique constraint failed, Field Exist!");
			} else if (error.code === "P2003") {
				return res
					.status(404)
					.send(
						"Foreign key constraint failed, Connection Field Doesn't Exist!",
					);
			}
		}
		return res.status(500).send(error.message);
	}
};

const GetAllArticles = async (req, res) => {
	try {
		const [Articles, count] = await prisma.$transaction([
			prisma.articles.findMany({
				include: {
					User: true,
					Image: true,
					Articles_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.articles.count(),
		]);

		if (!Articles) {
			return res.status(404).send("No Articles Were Found!");
		}
		res.status(200).json({
			count,
			Articles,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveArticles = async (req, res) => {
	try {
		const [Articles, count] = await prisma.$transaction([
			prisma.articles.findMany({
				where: { ActiveStatus: true },
				include: {
					User: true,
					Image: true,
					Articles_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.articles.count({ where: { ActiveStatus: true } }),
		]);
		if (!Articles) {
			return res.status(404).send("No Articles Were Found!");
		}
		res.status(200).json({
			count,
			Articles,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetArticleByID = async (req, res) => {
	try {
		const id = req.params.id;
		const Article = await prisma.articles.findUnique({
			where: { id: id },
			include: {
				User: true,
				Image: true,
				Articles_Translation: {
					include: { Language: true },
				},
			},
		});
		if (!Article) {
			return res.status(404).send("No Article Were Found!");
		}
		res.status(200).send(Article);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO: Change update articles
const UpdateArticle = async (req, res) => {
	try {
		const id = req.params.id;
		const ArticleData = req.body;
		const image = req.file;
		const data = [{}];
		// console.log(ArticleData);
		// console.log(data);
		ArticleData.LanguageID.map((item, key) => {
			data[key] = {
				languagesID: item,
				Title: ArticleData?.Title[key],
				Description: ArticleData?.Description[key],
				Caption: ArticleData?.Caption[key],
			};
		});
		// console.log("Data: ", data);

		const Results = await prisma.$transaction(async (prisma) => {
			let Msg = "";
			let Code = 201;
			let Language = "";
			let langID = [];
			data.map((item) => {
				langID.push(item.languagesID);
			});
			// console.log("lang: ", langID);
			const Article = await prisma.articles.update({
				where: { id: id },
				data: {
					MinRead: parseInt(ArticleData.MinRead),
					ActiveStatus:
						String(ArticleData?.ActiveStatus).toLowerCase() === "true",
					Image: image
						? {
								create: {
									URL: `/public/images/article/${
										Math.floor(new Date().getTime() / 1000) +
										"-" +
										image?.originalname
									}`,
									Alt: image?.originalname,
									Size: image.size,
									Type: image.mimetype,
									user: undefined,
								},
						  }
						: undefined,
				},
				include: {
					Image: true,
					Articles_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});
			const Languages = await prisma.languages.findMany({
				select: { id: true },
			});
			console.log("Lang: ", Languages);
			// const Translations = await prisma.articles_Translation.upsert({});
			Languages.map((language) => {
				prisma.articles_Translation.update({
					where: { languagesID: language.id },
					data: data,
				});
			});
			return { Article };
		});

		return res.status(201).send(Results);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO : check deleting conditions
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
