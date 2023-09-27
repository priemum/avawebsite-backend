const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateAddress = async (req, res) => {
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
		data.Longitude = parseFloat(data.Longitude);
		data.Latitude = parseFloat(data.Latitude);
		if (data.ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		const Address = await prisma.address.create({
			data: {
				Longitude: data.Longitude,
				Latitude: data.Latitude,
				ActiveStatus: data?.ActiveStatus,
				Address_Translation: {
					createMany: {
						data: data.Address_Translation,
					},
				},
				Address: data?.AddressID && {
					connect: {
						id: data?.AddressID,
					},
				},
				Image: data?.Image,
			},
			include: {
				Image: true,
				Addresses: {
					include: {
						Address_Translation: {
							include: { Language: true },
						},
					},
				},
				Address_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Address);
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

const GetAllAddresses = async (req, res) => {
	try {
		const [Address, count] = await prisma.$transaction([
			prisma.address.findMany({
				include: {
					Image: true,
					Address_Translation: {
						include: { Language: true },
					},
					Addresses: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
				},
			}),
			prisma.address.count(),
		]);

		if (!Address) {
			return res.status(404).send("No Addresses Were Found!");
		}
		res.status(200).json({
			count,
			Address,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveAddresses = async (req, res) => {
	try {
		const [Address, count] = await prisma.$transaction([
			prisma.address.findMany({
				where: { ActiveStatus: true },
				include: {
					Image: true,
					Address_Translation: {
						include: { Language: true },
					},
					Addresses: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
				},
			}),
			prisma.address.count({ where: { ActiveStatus: true } }),
		]);
		if (!Address) {
			return res.status(404).send("No Address Were Found!");
		}
		res.status(200).json({
			count,
			Address,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAddressByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Address = await prisma.address.findUnique({
			where: { id: id },
			include: {
				Image: true,
				Address_Translation: {
					include: { Language: true },
				},
				Addresses: {
					include: {
						_count: true,
						Address_Translation: {
							include: { Language: true },
						},
					},
				},
			},
		});
		if (!Address) {
			return res.status(404).send("No Address Were Found!");
		}
		res.status(200).send(Address);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
const GetAddressByParentID = async (req, res) => {
	try {
		const id = req.params.id;
		const [Address, count] = await prisma.$transaction([
			prisma.address.findMany({
				where: {
					addressID: id,
				},
				include: {
					Image: true,
					Address_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.address.count({
				where: {
					addressID: id,
				},
			}),
		]);
		if (!Address) {
			return res
				.status(404)
				.send("No Sub Addresses Were Found For this Address!");
		}
		res.status(200).json({
			count,
			Address,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO: Change update articles
const UpdateAddress = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const image = req.file;
		const Selected = { id: true };
		updates.forEach((item) => {
			if (item !== "AddressID") Selected[item] = true;
		});
		if (image) {
			Selected["Image"] = true;
		}

		const data = await prisma.address.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Address was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		data.Longitude = parseFloat(data.Longitude);
		data.Latitude = parseFloat(data.Latitude);
		if (image) {
			if (data.Image !== null) {
				if (fs.existsSync(`.${data.Image.URL}`)) {
					fs.unlinkSync(`.${data.Image.URL}`);
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
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}

		const result = await prisma.$transaction(async (prisma) => {
			data.Address_Translation &&
				data.Address_Translation.map(async (item) => {
					{
						await prisma.Address_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { addressID: id }],
							},
							data: {
								Name: item.Name,
							},
						});
					}
				});
			const UpdatedAddress = await prisma.address.update({
				where: { id: id },
				data: {
					Longitude: data?.Longitude || undefined,
					Latitude: data?.Latitude || undefined,
					ActiveStatus: data?.ActiveStatus,
					Image: data?.Image,
					Address: data?.AddressID && {
						connect: {
							id: data?.AddressID,
						},
					},
				},
				include: {
					Image: true,
					Address_Translation: {
						include: {
							Language: true,
						},
					},
					Addresses: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
				},
			});

			return UpdatedAddress;
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
const DeleteAddress = async (req, res) => {
	try {
		const id = req.params.id;
		const Address = await prisma.address.findFirst({
			where: { id: id },
			include: {
				Image: true,
				Address_Translation: {
					include: {
						Language: true,
					},
				},
				Addresses: {
					include: {
						Address_Translation: {
							include: { Language: true },
						},
					},
				},
			},
		});
		const imageURL = Address.Image?.URL;
		const imageID = Address.Image?.id;
		// const UserID = Address.Users?.id;
		let isImageDeleted = false;
		if (imageID !== undefined) {
			if (fs.existsSync(`.${imageURL}`)) {
				fs.unlinkSync(`.${imageURL}`);
				isImageDeleted = true;
			} else {
				isImageDeleted = true;
			}
		} else {
			if (Address.Address_Translation.length > 0) {
				await prisma.address_Translation.deleteMany({
					where: { addressID: id },
				});
			}
			await prisma.address.delete({ where: { id: Address.id } });
		}
		if (isImageDeleted) {
			if (Address.Address_Translation.length > 0) {
				await prisma.address_Translation.deleteMany({
					where: { addressID: id },
				});
			}
			if (Address.Addresses > 0) {
				await prisma.address.deleteMany({
					where: {
						addressID: id,
					},
				});
			}

			await prisma.address.delete({ where: { id: Address.id } });
			console.log("Deleting ...");
			await prisma.images.delete({ where: { id: imageID } });
		}
		// console.log("Role: ", Role);
		res.status(200).json({
			"Image Deleted: ": imageURL,
			Address,
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
	CreateAddress,
	GetAllAddresses,
	GetAddressByID,
	GetAddressByParentID,
	GetAllActiveAddresses,
	UpdateAddress,
	DeleteAddress,
};
