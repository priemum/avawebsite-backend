const jwt = require("jsonwebtoken");
// const prisma = require("./prismaClient");
require("dotenv").config;

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) return res.status(401).send("User Does not exist!");
	const refreshToken = cookies.jwt;

	const foundUser = await prisma.user.findFirst({
		where: { refreshToken: refreshToken },
	});
	if (!foundUser) return res.status(403).send("User Was not Found!"); //Forbidden
	// evaluate jwt
	jwt.verify(refreshToken, process.env.REFERSH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.userName !== decoded.userName)
			return res.status(403).send(err.message);
		const accessToken = jwt.sign(
			{
				UserInfo: {
					userName: decoded.userName,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "100s" },
		);
		res.json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
