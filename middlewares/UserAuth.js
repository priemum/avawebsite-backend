const prisma = require("../prismaClient");

const saveUser = async (req, res, next) => {
	try {
		const Gender = req.body.Gender;
		if (Gender) {
			if (Gender !== "Male" && Gender !== "Female") {
				throw new Error("Incorrect Gender input!");
			}
		}
		if (req.method === "POST") {
			const emailcheck = await prisma.users.findFirst({
				where: {
					Email: req.body.Email,
				},
			});
			if (emailcheck) {
				throw new Error("Email Already Exists!");
			}
		}

		next();
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	saveUser,
};
