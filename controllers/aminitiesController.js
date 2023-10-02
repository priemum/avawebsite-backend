const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateAminity = async (req, res) => {
	try {
		const image = req.file;
		// const data = [{}];
		const data = req.body;
		if (image) {
			data.Image = {
				create: {
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					user: undefined,
				},
			};
		}
		// if (data.ActiveStatus) {
		// 	if (req.body.ActiveStatus.toLowerCase() === "false") {
		// 		data.ActiveStatus = false;
		// 	} else {
		// 		data.ActiveStatus = true;
		// 	}
		// }
		const Aminity = await prisma.aminities.create({
			data: {
				Aminities_Translation: {
					createMany: {
						data: data.Aminities_Translation,
					},
				},
				Image: data?.Image,
			},
			include: {
				Image: true,
				Aminities_Translation: {
					include: {
						Language: true,
					},
				},
				Properties: true,
			},
		});
		return res.status(201).send(Aminity);
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

const GetAllAminities = async (req, res) => {
	try {
		const [Aminities, count] = await prisma.$transaction([
			prisma.aminities.findMany({
				include: {
					Image: true,
					Aminities_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.aminities.count(),
		]);

		if (!Aminities) {
			return res.status(404).send("No Aminities Were Found!");
		}
		res.status(200).json({
			count,
			Aminities,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAminityByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Aminities = await prisma.aminities.findUnique({
			where: { id: id },
			include: {
				Image: true,
				Aminities_Translation: {
					include: { Language: true },
				},
			},
		});
		if (!Aminities) {
			return res.status(404).send("No Aminities Were Found!");
		}
		res.status(200).send(Aminities);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateAminity = async (req, res) => {
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

		const data = await prisma.aminities.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Aminities was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		if (image) {
			if (data.Image !== null) {
				if (fs.existsSync(`${data.Image.URL}`)) {
					fs.unlinkSync(`${data.Image.URL}`);
				}
				await prisma.images.delete({ where: { id: data.Image.id } });
			}
			data.Image = {
				create: {
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					teamID: undefined,
				},
			};
		}
		// if (updates.includes("ActiveStatus")) {
		// 	if (req.body.ActiveStatus.toLowerCase() === "false") {
		// 		data.ActiveStatus = false;
		// 	} else {
		// 		data.ActiveStatus = true;
		// 	}
		// }

		const result = await prisma.$transaction(async (prisma) => {
			data.Aminities_Translation &&
				data.Aminities_Translation.map(async (item) => {
					{
						await prisma.aminities_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { aminitiesID: id }],
							},
							data: {
								Name: item.Name,
								Description: item.Description,
							},
						});
					}
				});
			const UpdatedAminities = await prisma.aminities.update({
				where: { id: id },
				data: {
					Image: data?.Image,
				},
				include: {
					Image: true,
					Aminities_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});

			return UpdatedAminities;
		});

		return res.status(200).json({
			Message: "Updated successfully",
			result,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO : check deleting conditions
const DeleteAminity = async (req, res) => {
	try {
		const id = req.params.id;
		const Aminity = await prisma.aminities.findFirst({
			where: { id: id },
			include: {
				Image: true,
				Aminities_Translation: {
					include: {
						Language: true,
					},
				},
				Properties: true,
			},
		});
		if (Aminity.Properties > 0) {
			return res
				.status(400)
				.send("Properties Connected to this Amenities, Cannot Delete!!");
		}
		const imageURL = Aminity.Image?.URL;
		const imageID = Aminity.Image?.id;
		// const UserID = Address.Users?.id;
		let isImageDeleted = false;
		if (imageID !== undefined) {
			if (fs.existsSync(`${imageURL}`)) {
				fs.unlinkSync(`${imageURL}`);
				isImageDeleted = true;
			} else {
				isImageDeleted = true;
			}
		} else {
			if (Aminity.Aminities_Translation.length > 0) {
				await prisma.aminities_Translation.deleteMany({
					where: { aminitiesID: id },
				});
			}
			await prisma.Aminity.delete({ where: { id: Address.id } });
		}
		if (isImageDeleted) {
			if (Aminity.Aminities_Translation.length > 0) {
				await prisma.aminities_Translation.deleteMany({
					where: { aminitiesID: id },
				});
			}

			await prisma.aminities.delete({ where: { id: Aminity.id } });
			console.log("Deleting ...");
			await prisma.images.delete({ where: { id: imageID } });
		}
		// console.log("Role: ", Role);
		res.status(200).json({
			"Image Deleted: ": imageURL,
			Aminity,
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
	CreateAminity,
	GetAllAminities,
	GetAminityByID,
	UpdateAminity,
	DeleteAminity,
};
