const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let path = req.url.split("/")[1];
		console.log(path);
		if (path === "auth") {
			path = "users";
		}
		if (!fs.existsSync("./public/files/")) {
			fs.mkdirSync(`./public/files/`);
		}
		if (fs.existsSync(`./public/files/${path}`)) {
			cb(null, `./public/files/${path}`);
		} else {
			try {
				fs.mkdirSync(`./public/files/${path}`);
				cb(null, `./public/files/${path}`);
			} catch (error) {
				console.log("Error");
				console.log(error);
			}
		}
	},
	filename: function (req, file, cb) {
		cb(null, Math.floor(new Date().getTime() / 1000) + "-" + file.originalname);
	},
});

const uploadFile = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 4,
	},
	fileFilter(req, file, cb) {
		if (
			!file.originalname.match(
				/\.(jpg|jpeg|png|JPG|JPEG|PNG|webp|doc|DOC|PDF|pdf|docx|DOCX)$/,
			)
		) {
			cb(null, false);
			return cb(
				new Error(
					"File type not allowed! Please upload a (jpg or jpeg or png or webp or pdf or doc ) file ",
				),
			);
		}
		if (file.size > 1024 * 1024 * 4) {
			cb(null, false);
			return cb(new multer.MulterError("File is Larger than 4 MB "));
		}
		cb(undefined, true);
	},
}).single("File");

module.exports = { uploadFile };
