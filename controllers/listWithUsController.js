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
		if (data.Bacloney) {
			if (req.body.Bacloney.toLowerCase() === "false") {
				data.Bacloney = false;
			} else {
				data.Bacloney = true;
			}
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
			},
			include: {
				Owner: true,
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
		const [Listings, count] = await prisma.$transaction([
			prisma.listWithUs.findMany({
				include: {
					Owner: true,
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

		const Listing = await prisma.listWithUs.findMany({
			where: {
				Owner: {
					Email: email,
				},
			},
			include: {
				Owner: true,
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

const TransferToProperty = async (req, res) => {
	try {
		const id = req.params.id;
		const ListingData = await prisma.listWithUs.findUnique({
			where: {
				id: id,
			},
		});
		const Property = await prisma.property.create({
			data: {
				Price: ListingData.Price,
				Bedrooms: ListingData.Bedrooms,
				Bacloney: ListingData.Bacloney,
				BalconySize: ListingData.BalconySize,
				Area: ListingData.Area,
				RentMin: ListingData.RentMin,
				RentMax: ListingData.RentMax,
				Handover: ListingData.Handover,
				FurnishingStatus: ListingData.FurnishingStatus,
				VacantStatus: ListingData.VacantStatus,
				Longitude: ListingData.Longitude,
				Latitude: ListingData.Latitude,
				ActiveStatus: false,
				Purpose: ListingData.Purpose,
				PermitNumber: ListingData.PermitNumber,
				DEDNo: ListingData.DEDNo,
				ReraNo: ListingData.ReraNo,
				BRNNo: ListingData.BRNNo,
			},
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
		const Listing = await prisma.listWithUs.delete({
			where: { id: id },
		});
		if (!Listing) {
			return res.status(404).send("Listing Does not Exist!");
		}
		res.status(200).send(Listing);
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
	TransferToProperty,
	GetListingByGuestEmail,
	DeleteListing,
};
