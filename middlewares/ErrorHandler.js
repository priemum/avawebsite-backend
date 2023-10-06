const { Prisma } = require("@prisma/client");

// const HandleError = (err) => {
// 	return async (req, res, next) => {
// 		console.log("Hello from Error Handler");
// 		console.log("Error: " + err);
// 		if (err instanceof Prisma.PrismaClientKnownRequestError) {
// 			if (err.code === "P2025") {
// 				return res.status(400).send("Record Doesn't Exist!");
// 			}
// 			console.log("Error: " + err.code);
// 		}
// 		next();
// 	};
// };
const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
	logEvents(`${err.name}: ${err.message}`, "errLog.txt");
	console.error(err.stack);
	res.status(500).send(err.message);
};

module.exports = {
	errorHandler,
};
