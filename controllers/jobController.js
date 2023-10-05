const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { Prisma } = require("@prisma/client");
const { HandleError } = require("../middlewares/ErrorHandler");
const fs = require("fs");
const { json } = require("express");
require("dotenv").config;

const CreateJob = async (req, res) => {
	try {
		const data = req.body;
		if (data.ActiveStatus) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		if (data.Expired) {
			if (req.body.Expired.toLowerCase() === "false") {
				data.Expired = false;
			} else {
				data.Expired = true;
			}
		}
		const Job = await prisma.jobs.create({
			data: {
				Location: data?.Location,
				Type: data?.Type,
				WeekHours: data?.WeekHours,
				ActiveStatus: data?.ActiveStatus,
				Expired: data?.Expired,
				Jobs_Translation: {
					createMany: {
						data: data.Jobs_Translation,
					},
				},
				Author: data?.AuthorID && {
					connect: {
						id: data?.AuthorID,
					},
				},
			},
			include: {
				Jobs_Translation: {
					include: {
						Language: true,
					},
				},
				Author: {
					include: {
						Image: true,
						Team: true,
					},
				},
			},
		});
		return res.status(201).send(Job);
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

const GetAllJobs = async (req, res) => {
	try {
		const [Jobs, count] = await prisma.$transaction([
			prisma.jobs.findMany({
				include: {
					Jobs_Translation: {
						include: {
							Language: true,
						},
					},
					Author: {
						include: {
							Image: true,
							Team: true,
						},
					},
				},
			}),
			prisma.jobs.count(),
		]);

		if (!Jobs) {
			return res.status(404).send("No Jobs Were Found!");
		}
		res.status(200).json({
			count,
			Jobs,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetAllActiveJobs = async (req, res) => {
	try {
		const [Jobs, count] = await prisma.$transaction([
			prisma.jobs.findMany({
				where: { ActiveStatus: true },
				include: {
					Jobs_Translation: {
						include: {
							Language: true,
						},
					},
					Author: {
						include: {
							Image: true,
							Team: true,
						},
					},
				},
			}),
			prisma.jobs.count({ where: { ActiveStatus: true } }),
		]);
		if (!Jobs) {
			return res.status(404).send("No Jobs Were Found!");
		}
		res.status(200).json({
			count,
			Jobs,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const GetJobByID = async (req, res) => {
	try {
		const id = req.params.id;

		const Jobs = await prisma.jobs.findUnique({
			where: { id: id },
			include: {
				Jobs_Translation: {
					include: {
						Language: true,
					},
				},
				Author: {
					include: {
						Image: true,
						Team: true,
					},
				},
			},
		});
		if (!Jobs) {
			return res.status(404).send("No Jobs Were Found!");
		}
		res.status(200).send(Jobs);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
const GetJobByUserID = async (req, res) => {
	try {
		const id = req.params.id;
		const [Jobs, count] = await prisma.$transaction([
			prisma.jobs.findMany({
				where: {
					Author: {
						id: id,
					},
				},
				include: {
					Jobs_Translation: {
						include: {
							Language: true,
						},
					},
					Author: {
						include: {
							Image: true,
							Team: true,
						},
					},
				},
			}),
			prisma.jobs.count({
				where: {
					Author: {
						id: id,
					},
				},
			}),
		]);
		if (!Jobs) {
			return res.status(404).send("No Jobs Were Found For this User!");
		}
		res.status(200).json({
			count,
			Jobs,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};
// ToDO: Change update articles
const UpdateJob = async (req, res) => {
	try {
		const id = req.params.id;
		const updates = Object.keys(req.body);
		const Selected = { id: true };
		updates.forEach((item) => {
			if (item !== "AuthorID") Selected[item] = true;
		});

		const data = await prisma.jobs.findUnique({
			where: { id: id },
			select: Selected,
		});
		if (!data) {
			return res.status(404).send("Job was not Found!");
		}
		updates.forEach((update) => (data[update] = req.body[update]));
		if (updates.includes("ActiveStatus")) {
			if (req.body.ActiveStatus.toLowerCase() === "false") {
				data.ActiveStatus = false;
			} else {
				data.ActiveStatus = true;
			}
		}
		if (updates.includes("Expired")) {
			if (req.body.Expired.toLowerCase() === "false") {
				data.Expired = false;
			} else {
				data.Expired = true;
			}
		}

		const result = await prisma.$transaction(async (prisma) => {
			data.Jobs_Translation &&
				data.Jobs_Translation.map(async (item) => {
					{
						await prisma.jobs_Translation.updateMany({
							where: {
								AND: [{ languagesID: item.languagesID }, { jobsId: id }],
							},
							data: {
								Title: item.Title,
								Description: item.Description,
							},
						});
					}
				});
			const UpdatedJob = await prisma.jobs.update({
				where: { id: id },
				data: {
					Location: data?.Location,
					Type: data?.Type,
					WeekHours: data?.WeekHours,
					ActiveStatus: data?.ActiveStatus,
					Expired: data?.Expired,
					Author: data?.AuthorID && {
						connect: {
							id: data?.AuthorID,
						},
					},
				},
				include: {
					Jobs_Translation: {
						include: {
							Language: true,
						},
					},
					Author: {
						include: {
							Image: true,
							Team: true,
						},
					},
				},
			});

			return UpdatedJob;
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
const DeleteJob = async (req, res) => {
	try {
		const id = req.params.id;
		const Job = await prisma.jobs.findFirst({
			where: { id: id },
			include: {
				Jobs_Translation: {
					include: {
						Language: true,
					},
				},
				Author: {
					include: {
						Image: true,
						Team: true,
					},
				},
			},
		});
		if (Job === null) {
			return res.status(404).send("No Job Was Found!");
		}
		if (Job.Jobs_Translation.length > 0) {
			await prisma.jobs_Translation.deleteMany({
				where: { jobsId: id },
			});
		}
		await prisma.jobs.delete({
			where: {
				id: Job.id,
			},
		});

		// console.log("Role: ", Role);
		res.status(200).send(Job);
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
	CreateJob,
	GetAllJobs,
	GetJobByID,
	GetJobByUserID,
	GetAllActiveJobs,
	UpdateJob,
	DeleteJob,
};
