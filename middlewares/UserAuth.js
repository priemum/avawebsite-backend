const prisma = require("../prismaClient");
const saveUser = async (req, res, next) => {
	try {
		const Gender = req.body.Gender;
		if (Gender) {
			if (Gender !== "Male" && Gender !== "Female") {
				throw new Error("Incorrect Gender input!");
			}
		}
		console.log(req.body.Email);
		if (req.method === "POST") {
			const emailcheck = await prisma.users.findUnique({
				where: {
					Email: req.body.Email,
				},
			});
			console.log(emailcheck);
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
