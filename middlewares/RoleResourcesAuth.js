const prisma = require("../prismaClient");

const CheckRoleResources = async (req, res, next) => {
	try {
		const { RoleID, ResourceID } = req.body;
		if (!RoleID || !ResourceID) {
			throw new Error("Role or Resource input must be provided!");
		}
		if (req.method === "POST") {
			const RoleCheck = await prisma.role.findFirstOrThrow({
				where: {
					id: RoleID,
				},
			});
			const ResourceCheck = await prisma.resources.findFirstOrThrow({
				where: {
					id: ResourceID,
				},
			});
		}
		const RoleResource = await prisma.role_Resources.findFirst({
			where: {
				AND: [{ resourcesID: ResourceID }, { roleID: RoleID }],
			},
		});
		if (RoleResource !== null) {
			throw new Error("Data Already Exist for this Role and Resource!");
		}
		next();
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	CheckRoleResources,
};
