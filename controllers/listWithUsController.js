const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateListing = async (req, res) => {
	try {
		const data = req.body;
		const images = req.files;
		data.Images = [];
		if (data.Bacloney) {
			if (req.body.Bacloney.toLowerCase() === "false") {
				data.Bacloney = false;
			} else {
				data.Bacloney = true;
			}
		}
		if (images) {
			images.map((image) => {
				data.Images.push({
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					user: undefined,
				});
			});
		}
		const Listing = await prisma.listWithUs.create({
			data: {
				Title: data.Title,
				Bedrooms: parseInt(data.Bedrooms),
				Bacloney: data.Bacloney,
				Price: parseFloat(data.Price),
				Type: data.Type,
				Purpose: data.Purpose,
				Owner: {
					connectOrCreate: {
						where: {
							Email: data.Email,
						},
						create: {
							Email: data.Email,
							FullName: data.FullName,
							Gender: data.Gender,
							IPAddress: data.IPAddress,
							PhoneNo: data.PhoneNo,
						},
					},
				},
				Images: {
					createMany: {
						data: data.Images,
					},
				},
				ListWithUs_Translation: {
					createMany: {
						data: data.ListWithUs_Translation,
					},
				},
			},
			include: {
				Owner: true,
				Images: true,
				ListWithUs_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Listing) {
			return res.status(400).send("Something Went Wrong!");
		}
		return res.status(201).send(Listing);
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

const GetAllListings = async (req, res) => {
	try {
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const [Listings, count] = await prisma.$transaction([
			prisma.listWithUs.findMany({
				skip: offset || undefined,
				take: limit || undefined,
				include: {
					Owner: true,
					Images: true,
					ListWithUs_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.listWithUs.count(),
		]);

		if (!Listings) {
			return res.status(404).send("No Listing Were Found!");
		}
		res.status(200).json({
			count,
			Listings,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetListingByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Listing = await prisma.listWithUs.findUnique({
			where: { id: id },
			include: {
				Owner: true,
				Images: true,
				ListWithUs_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Listing) {
			return res.status(404).send("No Listing Were Found!");
		}
		res.status(200).send(Listing);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Get Feedback by Guest Email

const GetListingByGuestEmail = async (req, res) => {
	try {
		const email = req.params.email;
		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit);
		const offset = (page - 1) * limit;
		const Listing = await prisma.listWithUs.findMany({
			where: {
				Owner: {
					Email: email,
				},
			},
			skip: offset || undefined,
			take: limit || undefined,
			include: {
				Owner: true,
				Images: true,
				ListWithUs_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Listing) {
			return res.status(404).send("No Listing Were Found for this Email!");
		}
		res.status(200).send(Listing);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateListing = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const images = req.files;
		const Selected = { id: true };
		updates.forEach((item) => {
			if (
				item !== "FullName" &&
				item !== "Email" &&
				item !== "IPAddress" &&
				item !== "PhoneNo" &&
				item !== "Gender" &&
				item !== "ListWithUs_Translation"
			)
				Selected[item] = true;
		});
		console.log(Selected);
		const data = await prisma.listWithUs.findUnique({
			where: {
				id: id,
			},
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Property was not Found!");
		}
		if (images) {
			data.Images = [];
		}
		if (images) {
			images.map(async (image) => {
				data.Images.push({
					URL: image.path,
					Alt: image?.originalname,
					Size: image.size,
					Type: image.mimetype,
					user: undefined,
				});
			});
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		if (data.Bacloney) {
			if (req.body.Bacloney.toLowerCase() === "false") {
				data.Bacloney = false;
			} else {
				data.Bacloney = true;
			}
		}
		const result = await prisma.$transaction(async (prisma) => {
			data.ListWithUs_Translation &&
				data.ListWithUs_Translation.map(async (item) => {
					{
						console.log("Inside Map");
						await prisma.listWithUs_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { listWithUsId: id }],
							},
							data: {
								Name: item?.Name,
								Description: item?.Description,
							},
						});
					}
				});
			const UpdatedListing = await prisma.listWithUs.update({
				where: {
					id: id,
				},
				data: {
					Title: data.Title || undefined,
					Bedrooms: parseInt(data.Bedrooms) || undefined,
					Bacloney: data.Bacloney || undefined,
					Price: parseFloat(data.Price) || undefined,
					Type: data.Type || undefined,
					Purpose: data.Purpose || undefined,
					Owner: {
						connectOrCreate: data.Email && {
							where: {
								Email: data.Email,
							},
							create: {
								Email: data.Email,
								FullName: data.FullName,
								Gender: data.Gender,
								IPAddress: data.IPAddress,
								PhoneNo: data.PhoneNo,
							},
						},
					},
					Images: {
						createMany: data.Images && {
							data: data.Images,
						},
					},
				},
				include: {
					Owner: true,
					Images: true,
					ListWithUs_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});
			return UpdatedListing;
		});
		return res.status(200).json({
			Message: "Updated successfully",
			result,
		});
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

const DeleteListing = async (req, res) => {
	try {
		const id = req.params.id;
		const Listing = await prisma.listWithUs.findUnique({
			where: {
				id: id,
			},
			include: {
				Owner: true,
				Images: true,
				ListWithUs_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Listing) {
			return res.status(404).send("Listing Does not Exist!");
		}

		if (Listing.Images.length > 0) {
			Listing.Images.map(async (image) => {
				if (fs.existsSync(image.URL)) {
					fs.unlinkSync(image.URL);
					await prisma.images.delete({
						where: {
							id: image.id,
						},
					});
				}
			});
		}
		if (Listing.ListWithUs_Translation.length > 0) {
			await prisma.listWithUs_Translation.deleteMany({
				where: { listWithUsId: id },
			});
		}
		await prisma.listWithUs.delete({
			where: { id: id },
		});
		res.status(200).json({
			"Image Deleted: ": Listing.Images,
			Listing,
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
	CreateListing,
	GetAllListings,
	GetListingByID,
	UpdateListing,
	GetListingByGuestEmail,
	DeleteListing,
};
