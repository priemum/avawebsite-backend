const prisma = require("../../prismaClient");

const resources = await prisma.resources.findMany({ include: {} });
