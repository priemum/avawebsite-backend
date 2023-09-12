const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
require("dotenv").config;

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) return res.status(401).send("User Does not exist!");
	const refreshToken = cookies.jwt;
	const foundUser = await prisma.users.findFirst({
		where: { refreshToken: refreshToken },
	});
	if (!foundUser) return res.status(403).send("User Was not Found!"); //Forbidden
	// evaluate jwt
	jwt.verify(refreshToken, process.env.REFERSH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.Email !== decoded.email) {
			return res.status(403).send(err);
		}
		const accessToken = jwt.sign(
			{
				UserData: {
					Email: decoded.email,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "5m" },
		);
		res.json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
