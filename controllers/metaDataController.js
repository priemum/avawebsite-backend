const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateMetaData = async (req, res) => {
	try {
		const data = req.body;
		const MetaData = await prisma.metaData.create({
			data: {
				Name: data.Name,
				Content: data.Content,
				Article: data?.ArticleID && {
					connect: {
						id: data.ArticleID,
					},
				},
				Property: data?.PropertyID && {
					connect: {
						id: data.PropertyID,
					},
				},
			},
		});
		return res.status(201).send(MetaData);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			} else if (error.code === "P2002") {
				return res.status(404).send(error.message);
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

const GetAllMetaData = async (req, res) => {
	try {
		const [MetaData, count] = await prisma.$transaction([
			prisma.metaData.findMany({
				include: {
					Article: {
						include: {
							Image: true,
							Articles_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Property: {
						include: {
							Property_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
				},
			}),
			prisma.metaData.count(),
		]);

		if (!MetaData) {
			return res.status(404).send("No MetaData Were Found!");
		}
		res.status(200).json({
			count,
			MetaData,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetMetaDataByID = async (req, res) => {
	try {
		const id = req.params.id;

		const MetaData = await prisma.metaData.findUnique({
			where: { id: id },
			include: {
				Article: {
					include: {
						Image: true,
						Articles_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Property: {
					include: {
						Property_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		if (!MetaData) {
			return res.status(404).send("No MetaData Were Found!");
		}
		res.status(200).send(MetaData);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
//Get Meta Data By Property ID
const GetMetaDataByPropertyID = async (req, res) => {
	try {
		const id = req.params.id;

		const MetaData = await prisma.metaData.findMany({
			where: { propertyId: id },
			include: {
				Article: {
					include: {
						Image: true,
						Articles_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Property: {
					include: {
						Property_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		if (!MetaData) {
			return res.status(404).send("No MetaData Were Found!");
		}
		res.status(200).send(MetaData);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
//Get Meta Data By Property ID
const GetMetaDataByArticleID = async (req, res) => {
	try {
		const id = req.params.id;

		const MetaData = await prisma.metaData.findMany({
			where: { articlesId: id },
			include: {
				Article: {
					include: {
						Image: true,
						Articles_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Property: {
					include: {
						Property_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		if (!MetaData) {
			return res.status(404).send("No MetaData Were Found!");
		}
		res.status(200).send(MetaData);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Update
const UpdateMetaData = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const Selected = { id: true };
		updates.forEach((item) => {
			if (item !== "ArticleID" && item !== "PropertyID") Selected[item] = true;
		});
		const data = await prisma.metaData.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("MetaData was not Found!");
		}
		console.log(Selected);
		updates.forEach((update) => (data[update] = req.body[update]));
		const UpdatedData = await prisma.metaData.update({
			where: {
				id: id,
			},
			data: {
				Name: data.Name,
				Content: data.Content,
				Article: data?.ArticleID && {
					connect: {
						id: data.ArticleID,
					},
				},
				Property: data?.PropertyID && {
					connect: {
						id: data.PropertyID,
					},
				},
			},
			include: {
				Article: {
					include: {
						Image: true,
						Articles_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Property: {
					include: {
						Property_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		return res.status(200).json({
			Message: "Updated successfully",
			UpdatedData,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteMetaData = async (req, res) => {
	try {
		const id = req.params.id;
		const MetaData = await prisma.metaData.findFirst({
			where: { id: id },
			include: {
				Article: {
					include: {
						Image: true,
						Articles_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Property: {
					include: {
						Property_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		if (MetaData.Article > 0) {
			return res
				.status(400)
				.send("Articles attached to this Meta Data, Cannot Delete!");
		}
		if (MetaData.Property > 0) {
			return res
				.status(400)
				.send("Properties attached to this Meta Data, Cannot Delete!");
		}
		if (!MetaData) {
			return res.status(404).send("MetaData Does not Exist!");
		}

		await prisma.metaData.delete({ where: { id: MetaData.id } });
		// console.log("Role: ", Role);
		res.status(200).send(MetaData);
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
	CreateMetaData,
	GetAllMetaData,
	GetMetaDataByID,
	GetMetaDataByArticleID,
	GetMetaDataByPropertyID,
	UpdateMetaData,
	DeleteMetaData,
};
