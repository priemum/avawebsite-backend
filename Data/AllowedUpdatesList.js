const allowedUpdatesList = [
	{ name: "role", value: ["Name", "ActiveStatus"] },
	{
		name: "users",
		value: [
			"Name",
			"Email",
			"Gender",
			"Password",
			"PhoneNo",
			"ActiveStatus",
			"roleID",
			"teamID",
			"DOB",
		],
	},
	{ name: "resources", value: ["Name", "Description", "ActiveStatus"] },
	{ name: "teams", value: ["Title", "Description", "ActiveStatus"] },
	{ name: "language", value: ["Name", "Code"] },
	{ name: "role-resource", value: ["Create", "Update", "Delete", "Read"] },
	{
		name: "article",
		value: [
			"MinRead",
			"ActiveStatus",
			"Image",
			"AuthorID",
			"Title",
			"Description",
			"Caption",
			"Articles_Translation",
		],
	},
	{
		name: "address",
		value: [
			"Longitude",
			"Latitude",
			"Address",
			"ActiveStatus",
			"Image",
			"Name",
			"Address_Translation",
		],
	},
	{
		name: "unit",
		value: [
			"conversionRate",
			"ActiveStatus",
			"Name",
			"Image",
			"Unit_Translation",
		],
	},
	{
		name: "currency",
		value: [
			"conversionRate",
			"ActiveStatus",
			"Name",
			"Image",
			"Currency_Translation",
		],
	},
	{
		name: "developer",
		value: ["ViewTag", "ActiveStatus", "Name", "Developer_Translation"],
	},
	,
	{
		name: "category",
		value: [
			"ParentID",
			"ActiveStatus",
			"Name",
			"Description",
			"Category_Translation",
		],
	},
	{
		name: "announcement",
		value: [
			"ParentID",
			"ActiveStatus",
			"StartDate",
			"EndDate",
			"Link",
			"Rank",
			"Type",
			"Title",
			"Description",
			"ButtonName",
			"Category_Translation",
		],
	},
	,
];

module.exports = {
	allowedUpdatesList,
};
