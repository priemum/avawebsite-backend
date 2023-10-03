const prisma = require("../prismaClient");

const saveProperty = async (req, res, next) => {
	try {
		const Purpose = req.body.Purpose;
		if (Purpose) {
			if (Purpose !== "Rent" && Purpose !== "Buy") {
				throw new Error("Incorrect Purpose input!");
			}
		}
		const RentFrequency = req.body.RentFrequency;
		if (RentFrequency) {
			if (
				RentFrequency !== "Yearly" &&
				RentFrequency !== "Monthly" &&
				RentFrequency !== "Weekly" &&
				RentFrequency !== "Daily" &&
				RentFrequency !== "Any"
			) {
				throw new Error("Incorrect Rent Frequency input!");
			}
		}
		const CompletionStatus = req.body.CompletionStatus;
		if (CompletionStatus) {
			if (CompletionStatus !== "Ready" && CompletionStatus !== "OffPlan") {
				throw new Error("Incorrect Completion Status input!");
			}
		}
		const DeveloperID = req.body.DeveloperID;
		const CategoryID = req.body.CategoryID;
		const AddressID = req.body.AddressID;
		await prisma.developer.findFirstOrThrow({ where: { id: DeveloperID } });
		await prisma.category.findFirstOrThrow({ where: { id: CategoryID } });
		await prisma.address.findFirstOrThrow({ where: { id: AddressID } });
		next();
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	saveProperty,
};
