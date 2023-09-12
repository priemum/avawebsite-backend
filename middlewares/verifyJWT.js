const jwt = require("jsonwebtoken");
require("dotenv").config;
const verifyJWT = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	if (!authHeader) return res.status(401).send("Unauthorized! ss");
	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
		if (err) return res.status(403).send(err.message); //invalid token
		req.Email = decode.email;
		next();
	});
};

module.exports = verifyJWT;
