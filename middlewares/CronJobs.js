const prisma = require("../prismaClient");
const schedule = require("node-schedule");

const testJob = async (err, req, res, next) => {
	let yourDate = new Date();
	yourDate.toISOString().split("T")[0];
	console.log(yourDate);
	const announcement = await prisma.announcements.findMany({
		select: {
			EndDate: true,
			id: true,
			StartDate: true,
			// Announcements_Translation: {
			// 	select: {
			// 		Title: true,
			// 	},
			// },
		},
	});
	// console.log(announcement);
	schedule.scheduleJob("Test-Job", "* * * * *", () => {
		console.log(yourDate);

		announcement.map((item) => {
			if (item.EndDate > yourDate) {
				console.log(item, " is Not Expired yet");
			} else {
				console.log(item, " is Expired ");
			}
		});
	});
	next();
};

module.exports = {
	testJob,
};
