const prisma = require("../prismaClient");

const GetGeneralData = async (req, res) => {
	try {
		const aggregation = await prisma.propertyUnits.aggregate({
			_max: {
				Price: true,
				Size: true,
			},
			_min: {
				Price: true,
				Size: true,
			},
			where: {
				Property: {
					ActiveStatus: true,
				},
			},
		});
		res.status(200).json({
			MaxPrice: aggregation._max.Price,
			MinPrice: aggregation._min.Price,
			MaxSize: aggregation._max.Size,
			MinSize: aggregation._min.Size,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

module.exports = {
	GetGeneralData,
};
