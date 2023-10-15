const prisma = require("../prismaClient");
const schedule = require("node-schedule");

const CronJob = async (err, req, res) => {
	let yourDate = new Date();
	console.log("Hi From Cron Job");
	yourDate.toISOString().split("T")[0];
	console.log(yourDate);
	const announcement = await prisma.announcements.findMany({
		select: {
			EndDate: true,
			id: true,
			StartDate: true,
			ActiveStatus: true,
			// Announcements_Translation: {
			// 	select: {
			// 		Title: true,
			// 	},
			// },
		},
	});
	schedule.scheduleJob("Cron-Job", "0 0 * * *", () => {
		if (announcement.length > 0) {
			console.log("pass");
			announcement.map(async (item) => {
				if (item.EndDate >= yourDate) {
					console.log(item, " is Not Expired yet");
				} else {
					item.ActiveStatus = false;
					console.log(item, " is Expired ");
					await prisma.announcements.update({
						where: { id: item.id },
						data: {
							ActiveStatus: item.ActiveStatus,
						},
					});
				}
			});
		} else {
			console.log("No Announcment were found");
		}
	});
	// console.log(schedule.scheduledJobs["Cron-Job"]);
	if (err) {
		console.log(err);
	}
};

module.exports = {
	CronJob,
};
