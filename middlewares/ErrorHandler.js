const { Prisma } = require("@prisma/client");

const HandleError = (err) => {
	return async (req, res, next) => {
		console.log("Hello from Error Handler");
		console.log("Error: " + err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				return res.status(400).send("Record Doesn't Exist!");
			}
			console.log("Error: " + err.code);
		}
		next();
	};
};
module.exports = {
	HandleError,
};
