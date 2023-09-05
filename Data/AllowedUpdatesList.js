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
			"DOB",
		],
	},
	{ name: "resources", value: ["Name", "Description", "ActiveStatus"] },
	{ name: "teams", value: ["Title", "Description", "ActiveStatus"] },
	,
];

module.exports = {
	allowedUpdatesList,
};
