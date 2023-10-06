const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let path = req.url.split("/")[1];
		console.log(path);
		if (path === "auth") {
			path = "users";
		}
		if (fs.existsSync(`./public/images/${path}`)) {
			cb(null, `./public/images/${path}`);
		} else {
			try {
				fs.mkdirSync(`./public/images/${path}`);
				cb(null, `./public/images/${path}`);
			} catch (error) {
				console.log(error);
			}
		}
	},
	filename: function (req, file, cb) {
		cb(null, Math.floor(new Date().getTime() / 1000) + "-" + file.originalname);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 6,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|webp)$/)) {
			cb(null, false);
			return cb(
				new Error("Please upload a (jpg or jpeg or Png or Webp) image "),
			);
		}
		if (file.size > 1024 * 1024 * 6) {
			cb(null, false);
			return cb(new multer.MulterError("File is Larger than 6 MB "));
		}
		cb(undefined, true);
	},
}).single("Image");
const uploadMultiple = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 6,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|webp)$/)) {
			cb(null, false);
			return cb(
				new Error("Please upload a (jpg or jpeg or Png or Webp) image "),
			);
		}
		if (file.size > 1024 * 1024 * 6) {
			cb(null, false);
			return cb(new multer.MulterError("File is Larger than 6 MB "));
		}
		cb(undefined, true);
	},
}).array("Images");
module.exports = { upload, uploadMultiple };
