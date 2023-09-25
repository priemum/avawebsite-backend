const { allowedUpdatesList } = require("../Data/AllowedUpdatesList");

const CheckAllowedUpdates = (entity) => {
	return async (req, res, next) => {
		const updates = Object.keys(req.body);
		console.log(req.body);
		let allowedUpdates = [];
		console.log("Updates: ", updates);
		console.log(
			"allowedUpdates: ",
			allowedUpdatesList.find((item) => item.name == "article"),
		);
		allowedUpdatesList.map((item) => {
			if (item.name == entity) {
				allowedUpdates = item.value;
			}
		});
		const isValidOperation = updates.every((update) =>
			allowedUpdates.includes(update),
		);
		if (!isValidOperation) {
			return res.status(400).send("Invalid updates");
		}
		next();
	};
};

module.exports = {
	CheckAllowedUpdates,
};
