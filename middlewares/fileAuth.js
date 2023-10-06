const multer = require("multer");
const { uploadFile } = require("../controllers/fileController");

const CheckFile = async (req, res, next) => {
	try {
		uploadFile(req, res, function (err) {
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
	CheckFile,
};
