const { Prisma } = require("@prisma/client");
const prisma = require("../prismaClient");

const CheckPaymentPlan = async (req, res, next) => {
	try {
		let {
			PropertyUnits,
			propertyID,
			DownPayemnt,
			TotalMonths,
			Posthandover,
			NoOfPosthandoverMonths,
			PosthandoverPercentage,
			OnHandoverPercentage,
			DuringConstructionMonths,
			DuringConstructionPercentage,
			HandoverDate,
			Installments,
		} = req.body;

		let TotalPercentage =
			DownPayemnt + OnHandoverPercentage + DuringConstructionPercentage;
		if (Posthandover) {
			TotalPercentage += PosthandoverPercentage;
		}
		if (TotalPercentage > 100) {
			throw new Error("Error: Percentage Total Cannot Be Larger Than 100%!");
		}
		console.log(TotalMonths);
		if (TotalMonths <= 0) {
			throw new Error("Error: Number of Months Cannot be less that 1");
		}
		if (propertyID) {
			const Property = await prisma.property.findUniqueOrThrow({
				where: {
					id: propertyID,
				},
			});
		}
		if (PropertyUnits) {
			let Units = await prisma.propertyUnits.findMany({
				where: {
					id: {
						in: PropertyUnits,
					},
				},
			});
			if (Units.length !== PropertyUnits.length) {
				throw new Error("Error: One of the units Doesn't Exist!");
			}
		}

		if (Installments.length > 0) {
			const sumOfInstallment = Installments.reduce(
				(accumulator, currentValue) =>
					accumulator + currentValue.PercentageOfPayment,
				0,
			);
			if (sumOfInstallment > 100) {
				throw new Error(
					"Error: Total of Installments cannot be larger than 100%",
				);
			}
		}
		next();
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return res.status(404).send("Record Doesn't Exist!");
			} else if (error.code === "P2021") {
				return res.status(404).send("Table Doesn't Exist!");
			}
		}
		return res.status(409).send(error.message);
	}
};

module.exports = {
	CheckPaymentPlan,
};
