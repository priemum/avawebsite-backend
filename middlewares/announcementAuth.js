const prisma = require("../prismaClient");

const saveAnnouncement = async (req, res, next) => {
	try {
		const Type = req.body.Type;
		if (Type) {
			if (Type !== "Normal" && Type !== "Popup") {
				throw new Error("Incorrect Type input!");
			}
		}

		next();
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	saveAnnouncement,
};
