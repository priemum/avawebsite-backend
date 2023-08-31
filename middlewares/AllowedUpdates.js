const { allowedUpdatesList } = require("../Data/AllowedUpdatesList");

const CheckAllowedUpdates = async (req, res, next) => {
	try {
		const updates = Object.keys(req.body);
		// const allowedUpdates = allowedUpdates.role;
		console.log("Allowed: " + allowedUpdatesList["role"]);
		const isValidOperation = updates.every((update) =>
			allowedUpdates.includes(update),
		);
		if (!isValidOperation) {
			return res.status(400).send("Invalid updates");
		}
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	CheckAllowedUpdates,
};
