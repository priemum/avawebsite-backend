const prisma = require("../prismaClient");
const bcrypt = require("bcryptjs");
const languages = require("./seeds/languages");
const roles = require("./seeds/role");
const teams = require("./seeds/teams");
const resources = require("./seeds/resources");
const users = require("./seeds/users");
async function main() {
	//-------Languages ----------
	languages.languages.map(async (lang) => {
		// console.log(lang);
		await prisma.languages.upsert({
			where: { Name: lang.Name },
			update: {},
			create: {
				Name: lang.Name,
				Code: lang.Code,
			},
		});
	});

	//-------Role ----------
	roles.Roles.map(async (role) => {
		await prisma.role.upsert({
			where: { Name: role.Name },
			update: {},
			create: {
				Name: role.Name,
				ActiveStatus: true,
			},
		});
	});
	//-------Team ----------
	teams.Teams.map(async (team) => {
		await prisma.team.upsert({
			where: { Title: team.Title },
			update: {},
			create: {
				Title: team.Title,
				Description: team.Description,
			},
		});
	});
	// ------ Resources ---------
	resources.resources.map(async (resource) => {
		await prisma.resources.upsert({
			where: { Name: resource.Name },
			update: {},
			create: {
				Name: resource.Name,
				Description: resource.Description,
			},
		});
	});

	users.users.map(async (user) => {
		await prisma.users.upsert({
			where: { Email: user.Email },
			update: {},
			create: {
				Name: user.Name,
				Email: user.Email,
				Password: await bcrypt.hash(user.Password, 10),
				PhoneNo: user.PhoneNo,
				Gender: user.Gender,
				DOB: user.DOB,
				Role: { connect: { Name: user.Role } },
				Team: { connect: { Title: user.Team } },
			},
		});
	});
	//Add Role Resources for Super Admin
	const SuperAdminID = await prisma.role.findFirst({
		where: { Name: "Super Admin" },
		select: { id: true },
	});
	console.log("Super Aadmin ID: ", SuperAdminID.id);
	const AllResources = await prisma.resources.findMany();
	AllResources.map(async (resource) => {
		console.log("Resource: ", resource.Name);
		await prisma.resources.update({
			where: { Name: resource.Name },
			data: {
				Role_Resources: {
					create: {
						roleID: SuperAdminID.id,
						Create: true,
						Update: true,
						Read: true,
						Delete: true,
					},
				},
			},
		});
	});
	const AllRoles = await prisma.role.findMany({
		where: {
			id: {
				not: SuperAdminID.id,
			},
		},
	});
	AllRoles.map(async (role) => {
		await prisma.role_Resources.createMany({
			data: AllResources.map((resource) => ({
				roleID: role.id,
				resourcesID: resource.id,
				Create: false,
				Update: false,
				Read: false,
				Delete: false,
			})),
		});
	});
	// ------ USER ---------
	// await prisma.user.upsert({
	// 	where: { email: "kanaan@avarealestate.ae" },
	// 	update: {},
	// 	create: {
	// 		Name: "Super Admin",
	// 		Email: "kanaan@avarealestate.ae",
	// 		Password: await bcrypt.hash("admin@2023", 10),
	// 		PhoneNo: "+971507440233",
	// 		ActiveStatus: true,
	// 		Gender: "Male",
	// 		DOB: new Date("2023-01-01 00:00:00"),
	// 		Role: { connect: { Name: "Super Admin" } },
	// 		Team: { connect: { Title: "Software Development" } },
	// 		CreatedAt: new Date(),
	// 		UpdatedAt: new Date(),
	// 	},
	// });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
