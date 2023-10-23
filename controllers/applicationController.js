const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateApplication = async (req, res) => {
	try {
		const file = req.file;
		const data = req.body;
		if (file) {
			data.CVURL = file.path;
			data.CVFileType = file.mimetype;
			data.CVFileSize = file.size.toString();
			data.CVFileName = file.originalname;
		}
		data.YearsOfExp = parseFloat(data.YearsOfExp);
		const Applicantion = await prisma.applicantion.create({
			data: {
				YearsOfExp: data.YearsOfExp,
				AreaSpecialty: data.AreaSpecialty,
				CVURL: data.CVURL,
				CVFileType: data.CVFileType,
				CVFileSize: data.CVFileSize,
				CVFileName: data.CVFileName,
				Message: data.Message,
				LinkedInURL: data.LinkedInURL,
				Field: data.Field,
				EnglishLvl: data.EnglishLvl,
				ArabicLvl: data.ArabicLvl,
				OtherLanguages: data.OtherLanguages,
				Applicant: {
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
				Job: data?.jobID && {
					connect: {
						id: data?.jobID,
					},
				},
			},
			include: {
				Applicant: true,
				Job: {
					include: {
						Author: {
							include: {
								Image: true,
								Address: true,
								Team: true,
							},
							Jobs_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
				},
			},
		});
		return res.status(201).send(Applicantion);
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

const GetAllApplications = async (req, res) => {
	try {
		let { skip, take } = req.query;
		skip = parseInt(skip);
		take = parseInt(take);
		const [Applicantion, count] = await prisma.$transaction([
			prisma.applicantion.findMany({
				skip: skip || undefined,
				take: take || undefined,
				include: {
					Applicant: true,
					Job: {
						include: {
							Author: {
								include: {
									Image: true,
									Address: true,
									Team: true,
								},
							},

							Jobs_Translation: {
								include: {
									Language: true,
								},
							},
						},
					},
				},
			}),
			prisma.applicantion.count(),
		]);

		if (!Applicantion) {
			return res.status(404).send("No Applicantion Were Found!");
		}
		res.status(200).json({
			count,
			Applicantion,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetApplicationByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Applicantion = await prisma.applicantion.findUnique({
			where: { id: id },
			include: {
				Applicant: true,
				Job: {
					include: {
						Author: {
							include: {
								Image: true,
								Address: true,
								Team: true,
							},
						},
						Jobs_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		if (!Applicantion) {
			return res.status(404).send("No Applicantion Were Found!");
		}
		res.status(200).send(Applicantion);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
const GetApplicationByEmailID = async (req, res) => {
	try {
		const Email = req.params.email;

		const Applicantion = await prisma.applicantion.findMany({
			where: {
				Applicant: {
					Email,
				},
			},
			include: {
				Applicant: true,
				Job: {
					include: {
						Author: {
							include: {
								Image: true,
								Address: true,
								Team: true,
							},
						},
						Jobs_Translation: {
							include: {
								Language: true,
							},
						},
					},
				},
			},
		});
		if (!Applicantion) {
			return res.status(404).send("No Applicantion Were Found!");
		}
		res.status(200).send(Applicantion);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const DeleteApplication = async (req, res) => {
	try {
		const id = req.params.id;
		const Applicantion = await prisma.applicantion.findFirst({
			where: { id: id },
			include: {
				Applicant: true,
				Job: {
					include: {
						Author: {
							include: {
								Image: true,
								Address: true,
								Team: true,
							},
						},
					},
				},
			},
		});
		if (Applicantion === null) {
			return res.status(404).send("Application was not Found!");
		}
		const fileURL = Applicantion.CVURL;
		// const UserID = Address.Users?.id;
		if (fs.existsSync(`${fileURL}`)) {
			fs.unlinkSync(`${fileURL}`);
		}
		await prisma.applicantion.delete({
			where: {
				id: Applicantion.id,
			},
		});
		res.status(200).json({
			"Deleted File: ": fileURL,
			Applicantion,
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
	CreateApplication,
	GetAllApplications,
	GetApplicationByID,
	GetApplicationByEmailID,
	DeleteApplication,
};
