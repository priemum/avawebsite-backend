const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateAnnouncement = async (req, res) => {
	try {
		const image = req.file;
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
		data.Rank = parseInt(data.Rank);
		data.StartDate = new Date(data.StartDate);
		data.EndDate = new Date(data.EndDate);
		if (data.ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		const Announcement = await prisma.announcements.create({
			data: {
				EndDate: data?.EndDate || undefined,
				StartDate: data?.StartDate || undefined,
				Link: data?.Link || undefined,
				Rank: data?.Rank || undefined,
				Type: data?.Type || undefined,
				ActiveStatus: data?.ActiveStatus,
				Announcements_Translation: {
					createMany: {
						data: data.Announcements_Translation,
					},
				},
				Images: data?.Image,
			},
			include: {
				Images: true,
				Announcements_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		return res.status(201).send(Announcement);
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

const GetAllAnnouncements = async (req, res) => {
	try {
		const [Announcement, count] = await prisma.$transaction([
			prisma.announcements.findMany({
				include: {
					Images: true,
					Announcements_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.announcements.count(),
		]);

		if (!Announcement) {
			return res.status(404).send("No Announcements Were Found!");
		}
		res.status(200).json({
			count,
			Announcement,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveAnnouncements = async (req, res) => {
	try {
		const [Announcement, count] = await prisma.$transaction([
			prisma.announcements.findMany({
				where: { ActiveStatus: true },
				include: {
					Images: true,
					Announcements_Translation: {
						include: { Language: true },
					},
				},
			}),
			prisma.announcements.count({ where: { ActiveStatus: true } }),
		]);
		if (!Announcement) {
			return res.status(404).send("No Announcements Were Found!");
		}
		res.status(200).json({
			count,
			Announcement,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAnnouncementByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Announcement = await prisma.announcements.findUnique({
			where: { id: id },
			include: {
				Images: true,
				Announcements_Translation: {
					include: { Language: true },
				},
			},
		});
		if (!Announcement) {
			return res.status(404).send("No Announcements Were Found!");
		}
		res.status(200).send(Announcement);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const UpdateAnnouncement = async (req, res) => {
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

		const data = await prisma.announcements.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Announcement was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		data.Rank = parseInt(data.Rank);
		if (data.StartDate) data.StartDate = new Date(data.StartDate);
		if (data.EndDate) data.EndDate = new Date(data.EndDate);
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
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}

		const result = await prisma.$transaction(async (prisma) => {
			data.Announcements_Translation &&
				data.Announcements_Translation.map(async (item) => {
					{
						await prisma.announcements_Translation.updateMany({
							where: {
								AND: [
									{ languagesID: item.languagesID },
									{ announcementsID: id },
								],
							},
							data: {
								Title: item.Title,
								Description: item.Description,
								ButtonName: item.ButtonName,
							},
						});
					}
				});
			const UpdatedAnnouncement = await prisma.announcements.update({
				where: { id: id },
				data: {
					EndDate: data?.EndDate,
					StartDate: data?.StartDate,
					Link: data?.Link || undefined,
					Rank: data?.Rank || undefined,
					Type: data?.Type || undefined,
					ActiveStatus: data?.ActiveStatus,
					Images: data?.Image,
				},
				include: {
					Images: true,
					Announcements_Translation: {
						include: {
							Language: true,
						},
					},
				},
			});

			return UpdatedAnnouncement;
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
const DeleteAnnouncement = async (req, res) => {
	try {
		const id = req.params.id;
		const Announcement = await prisma.announcements.findFirst({
			where: { id: id },
			include: {
				Images: true,
				Announcements_Translation: {
					include: {
						Language: true,
					},
				},
			},
		});
		if (!Announcement) {
			return res.status(404).send("Announcement was not found!");
		}
		const imageURL = Announcement.Images?.URL;
		const imageID = Announcement.Images?.id;
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
			if (Announcement.Announcements_Translation.length > 0) {
				await prisma.announcements_Translation.deleteMany({
					where: { announcementsID: id },
				});
			}
			await prisma.announcements.delete({ where: { id: Announcement.id } });
		}
		if (isImageDeleted) {
			if (Announcement.Announcements_Translation.length > 0) {
				await prisma.announcements_Translation.deleteMany({
					where: { announcementsID: id },
				});
			}

			await prisma.announcements.delete({ where: { id: Announcement.id } });
			console.log("Deleting ...");
			await prisma.images.delete({ where: { id: imageID } });
		}
		// console.log("Role: ", Role);
		res.status(200).json({
			"Image Deleted: ": imageURL,
			Announcement,
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
	CreateAnnouncement,
	GetAllAnnouncements,
	GetAnnouncementByID,
	GetAllActiveAnnouncements,
	UpdateAnnouncement,
	DeleteAnnouncement,
};
