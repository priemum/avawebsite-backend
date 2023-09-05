const multer = require("multer");
const { upload } = require("../controllers/imageController");

const CheckImage = async (req, res, next) => {
	try {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				return res.status(400).send(err.message);
			} else if (err) {
				return res.status(400).send(err.message);
			}
			// Everything went fine.
			next();
		});
	} catch (error) {
		console.log("Multer Error");
		return res.status(400).send(error.message);
	}
};
module.exports = {
	CheckImage,
};
