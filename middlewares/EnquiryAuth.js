const prisma = require("../prismaClient");

const saveEnquiry = async (req, res, next) => {
	try {
		const Purpose = req.body.Purpose;
		const Bedrooms = parseInt(req.body.Bedrooms);
		const PriceMin = parseFloat(req.body.PriceMin);
		const PriceMax = parseFloat(req.body.PriceMax);
		if (Purpose) {
			if (Purpose !== "Rent" && Purpose !== "Buy") {
				throw new Error("Incorrect Purpose input!");
			}
		}
		// const RentFrequency = req.body.RentFrequency;
		// if (RentFrequency) {
		// 	if (
		// 		RentFrequency !== "Yearly" &&
		// 		RentFrequency !== "Monthly" &&
		// 		RentFrequency !== "Weekly" &&
		// 		RentFrequency !== "Daily" &&
		// 		RentFrequency !== "Any"
		// 	) {
		// 		throw new Error("Incorrect Rent Frequency input!");
		// 	}
		// }
		// const CompletionStatus = req.body.CompletionStatus;
		// if (CompletionStatus) {
		// 	if (CompletionStatus !== "Ready" && CompletionStatus !== "OffPlan") {
		// 		throw new Error("Incorrect Completion Status input!");
		// 	}
		// }
		if (Bedrooms < 0) {
			throw new Error("Number of Bedrooms Cannont be less Than Zero!");
		}
		if (PriceMax && PriceMin) {
			if (PriceMin > PriceMax) {
				throw new Error("Price Max Cannont be less Than Price Min!");
			}
			if (PriceMin < 0) {
				throw new Error("Price Min Cannont be less Than Zero!");
			}
			if (PriceMax < 0) {
				throw new Error("Price Max Cannont be less Than Zero!");
			}
		}
		next();
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	saveEnquiry,
};
