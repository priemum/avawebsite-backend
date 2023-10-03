const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateProperty = async (req, res) => {
	try {
		const images = req.files;

		const data = req.body;
		data.Images = [];
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
		data.Price = parseFloat(data.Price);
		data.Bedrooms = parseInt(data.Bedrooms);
		data.BalconySize = parseFloat(data.BalconySize);
		data.RentMin = parseFloat(data.RentMin);
		data.RentMax = parseFloat(data.RentMax);
		data.Longitude = parseFloat(data.Longitude);
		data.Latitude = parseFloat(data.Latitude);
		if (data.ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		if (data.Bacloney) {
			if (req.body.Bacloney.toLowerCase() === "false") {
				data.Bacloney = false;
			} else {
				data.Bacloney = true;
			}
		}
		const Property = await prisma.property.create({
			data: {
				Price: data.Price,
				Bedrooms: data.Bedrooms,
				Bacloney: data.Bacloney,
				BalconySize: data.BalconySize,
				RentMin: data.RentMin,
				RentMax: data.RentMax,
				Handover: data.Handover,
				FurnishingStatus: data.FurnishingStatus,
				VacantStatus: data.VacantStatus,
				Longitude: data.Longitude,
				Latitude: data.Latitude,
				ActiveStatus: data?.ActiveStatus,
				Purpose: data.Purpose,
				PermitNumber: data.PermitNumber,
				DEDNo: data.DEDNo,
				ReraNo: data.ReraNo,
				BRNNo: data.BRNNo,
				Property_Translation: {
					createMany: {
						data: data.Property_Translation,
					},
				},
				Developer: data?.DeveloperID && {
					connect: {
						id: data?.DeveloperID,
					},
				},
				Category: data?.CategoryID && {
					connect: {
						id: data?.CategoryID,
					},
				},
				Address: data?.AddressID && {
					connect: {
						id: data?.AddressID,
					},
				},
				Images: {
					createMany: {
						data: data.Images,
					},
				},
			},
			include: {
				Images: true,
				Aminities: true,
				Category: {
					include: {
						Category_Translation: {
							include: {
								Language: true,
							},
						},
						Parent: true,
					},
				},
				Developer: {
					include: {
						Developer_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Address: {
					include: {
						Address_Translation: {
							include: { Language: true },
						},
					},
				},
				Property_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Property);
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

const GetAllProperties = async (req, res) => {
	try {
		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count(),
		]);

		if (!Properties) {
			return res.status(404).send("No Properties Were Found!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveProperties = async (req, res) => {
	try {
		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { ActiveStatus: true },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({ where: { ActiveStatus: true } }),
		]);
		if (!Properties) {
			return res.status(404).send("No Properties Were Found!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
//Get Property By ID
const GetPropertyByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Property = await prisma.property.findUnique({
			where: { id: id },
			include: {
				Images: true,
				Aminities: true,
				Category: {
					include: {
						Category_Translation: {
							include: {
								Language: true,
							},
						},
						Parent: true,
					},
				},
				Developer: {
					include: {
						Developer_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
				Address: {
					include: {
						Address_Translation: {
							include: { Language: true },
						},
					},
				},
				Property_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Property) {
			return res.status(404).send("No Property Were Found!");
		}
		res.status(200).send(Property);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// Get Property by Category ID
const GetPropertiesByCategoryID = async (req, res) => {
	try {
		const id = req.params.id;

		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { categoryId: id },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({ where: { categoryId: id } }),
		]);
		if (!Properties) {
			return res
				.status(404)
				.send("No Properties Were Found Under This Category!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// Get Active Properties By Category ID
const GetActivePropertiesByCategoryID = async (req, res) => {
	try {
		const id = req.params.id;
		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { AND: [{ ActiveStatus: true }, { categoryId: id }] },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({
				where: { AND: [{ ActiveStatus: true }, { categoryId: id }] },
			}),
		]);
		if (!Properties) {
			return res
				.status(404)
				.send("No Active Properties Were Found Under This Category!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// Get Property by Developer ID
const GetPropertiesByDeveloperID = async (req, res) => {
	try {
		const id = req.params.id;

		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { developerId: id },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({ where: { developerId: id } }),
		]);
		if (!Properties) {
			return res
				.status(404)
				.send("No Properties Were Found Under This Developer!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// Get Active Properties By Address ID
const GetActivePropertiesByDeveloperID = async (req, res) => {
	try {
		const id = req.params.id;

		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { AND: [{ developerId: id }, { ActiveStatus: true }] },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({
				where: { AND: [{ developerId: id }, { ActiveStatus: true }] },
			}),
		]);
		if (!Properties) {
			return res
				.status(404)
				.send("No Active Properties Were Found Under This Developer!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// Get Property by Category ID
const GetPropertiesByAddressID = async (req, res) => {
	try {
		const id = req.params.id;

		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { addressId: id },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({ where: { addressId: id } }),
		]);
		if (!Properties) {
			return res
				.status(404)
				.send("No Properties Were Found Under This Address!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// Get Active Properties By Address ID
const GetActivePropertiesByAddressID = async (req, res) => {
	try {
		const id = req.params.id;

		const [Properties, count] = await prisma.$transaction([
			prisma.property.findMany({
				where: { AND: [{ addressId: id }, { ActiveStatus: true }] },
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			}),
			prisma.property.count({
				where: { AND: [{ addressId: id }, { ActiveStatus: true }] },
			}),
		]);
		if (!Properties) {
			return res
				.status(404)
				.send("No Active Properties Were Found Under This Address!");
		}
		res.status(200).json({
			count,
			Properties,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Update Property
const UpdateProperty = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const images = req.files;
		const Selected = { id: true };
		updates.forEach((item) => {
			if (
				item !== "AddressID" &&
				item !== "DeveloperID" &&
				item !== "CategoryID"
			)
				Selected[item] = true;
		});
		const data = await prisma.property.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Property was not Found!");
		}
		if (images) {
			data.Images = [];
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		data.Price = parseFloat(data?.Price);
		data.Bedrooms = parseInt(data?.Bedrooms);
		data.BalconySize = parseFloat(data?.BalconySize);
		data.RentMin = parseFloat(data?.RentMin);
		data.RentMax = parseFloat(data?.RentMax);
		data.Longitude = parseFloat(data?.Longitude);
		data.Latitude = parseFloat(data?.Latitude);
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
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		if (data.Bacloney) {
			if (req.body.Bacloney.toLowerCase() === "false") {
				data.Bacloney = false;
			} else {
				data.Bacloney = true;
			}
		}
		const result = await prisma.$transaction(async (prisma) => {
			if (data.Property_Translation !== undefined) {
				data.Property_Translation.map(async (item) => {
					{
						await prisma.property_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { propertyID: id }],
							},
							data: {
								Name: item.Name,
								Description: item.Description,
							},
						});
					}
				});
			}
			const UpdatedProperty = await prisma.property.update({
				where: { id: id },
				data: {
					Price: data.Price || undefined,
					Bedrooms: data.Bedrooms || undefined,
					Bacloney: data.Bacloney || undefined,
					BalconySize: data.BalconySize || undefined,
					RentMin: data.RentMin || undefined,
					RentMax: data.RentMax || undefined,
					Handover: data.Handover || undefined,
					FurnishingStatus: data.FurnishingStatus || undefined,
					VacantStatus: data.VacantStatus || undefined,
					Longitude: data.Longitude || undefined,
					Latitude: data.Latitude || undefined,
					ActiveStatus: data?.ActiveStatus || undefined,
					Purpose: data.Purpose || undefined,
					PermitNumber: data.PermitNumber || undefined,
					DEDNo: data.DEDNo || undefined,
					ReraNo: data.ReraNo || undefined,
					BRNNo: data.BRNNo || undefined,
					Property_Translation: data?.Property_Translation && {
						createMany: {
							data: data.Property_Translation,
						},
					},
					Developer: data?.DeveloperID && {
						connect: {
							id: data?.DeveloperID,
						},
					},
					Category: data?.CategoryID && {
						connect: {
							id: data?.CategoryID,
						},
					},
					Address: data?.AddressID && {
						connect: {
							id: data?.AddressID,
						},
					},
					Images: {
						createMany: {
							data: data.Images,
						},
					},
				},
				include: {
					Images: true,
					Aminities: true,
					Category: {
						include: {
							Category_Translation: {
								include: {
									Language: true,
								},
							},
							Parent: true,
						},
					},
					Developer: {
						include: {
							Developer_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
					Address: {
						include: {
							Address_Translation: {
								include: { Language: true },
							},
						},
					},
					Property_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});

			return UpdatedProperty;
		});

		return res.status(200).json({
			Message: "Updated successfully",
			result,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

//Delete All Images for a Property

const DeletePropertyImages = async (req, res) => {
	try {
		const id = req.params.id;
		const result = await prisma.$transaction(async (prisma) => {
			const Images = await prisma.images.findMany({
				where: {
					propertyId: id,
				},
			});
			if (Images.length > 0) {
				Images.map(async (image) => {
					if (fs.existsSync(image.URL)) {
						fs.unlinkSync(image.URL);
					}
				});
				await prisma.images.deleteMany({
					where: {
						propertyId: id,
					},
				});
			} else {
				return {
					Message: "No Images Were Found for This Property!",
					Images,
				};
			}
			return {
				Message: "Images Deleted Successfully ",
				Images,
			};
		});

		// if (Images.count === 0) {
		// 	return res.status(404).send("No Images were Found!");
		// }
		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
const DeleteImageByID = async (req, res) => {
	try {
		const id = req.params.id;
		const result = await prisma.$transaction(async (prisma) => {
			const Image = await prisma.images.findUnique({
				where: {
					id: id,
				},
			});
			if (Image) {
				if (fs.existsSync(Image.URL)) {
					fs.unlinkSync(Image.URL);
				}
				await prisma.images.delete({
					where: {
						id: id,
					},
				});
			} else {
				return {
					Message: "No Image Were Found for This Property!",
					Image,
				};
			}
			return {
				Message: "Image Deleted Successfully ",
				Image,
			};
		});

		// if (Images.count === 0) {
		// 	return res.status(404).send("No Images were Found!");
		// }
		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// Delete Property
const DeleteProperty = async (req, res) => {
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
	CreateProperty,
	GetAllProperties,
	GetPropertyByID,
	GetPropertiesByCategoryID,
	GetActivePropertiesByCategoryID,
	GetPropertiesByAddressID,
	GetActivePropertiesByAddressID,
	GetActivePropertiesByDeveloperID,
	GetPropertiesByDeveloperID,
	GetAllActiveProperties,
	UpdateProperty,
	DeletePropertyImages,
	DeleteImageByID,
	DeleteProperty,
};
