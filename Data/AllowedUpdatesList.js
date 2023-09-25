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
		],
	},
	{
		name: "address",
		value: ["Longitude", "Latitude", "Address", "Image", "Name"],
	},
	,
];

module.exports = {
	allowedUpdatesList,
};
