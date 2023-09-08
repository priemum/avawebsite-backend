const resources = [
	{
		Name: "Property",
		Description: "Preoperties Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Articles",
		Description: "Articles Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Team",
		Description: "Team Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Address",
		Description: "Address Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Currency",
		Description: "Currency Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Unit",
		Description: "Unit Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Images",
		Description: "Images Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Aminities",
		Description: "Aminities Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Category",
		Description: "Category Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Developer",
		Description: "Developer Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "PaymentPlan",
		Description: "PaymentPlan Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	// user: kanaan, role super admin
	// Role: Category , superadmin, crud
	// Kanaan --> Role --> check request methode : Post --> Path : category ---> Resources --> Cr
	// Resources ----> Role_Resources[] --->
	{
		Name: "Resources",
		Description: "Resources Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Role",
		Description: "Role Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "Users",
		Description: "Users Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
	{
		Name: "MetaData",
		Description: "MetaData Permission",
		ActiveStatus: true,
		CreatedAt: new Date(),
		UpdatedAt: new Date(),
	},
];
module.exports = {
	resources,
};
