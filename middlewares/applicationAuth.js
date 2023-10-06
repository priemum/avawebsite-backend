const prisma = require("../prismaClient");

const saveApplicantion = async (req, res, next) => {
	try {
		const YearsOfExp = parseInt(req.body.YearsOfExp);
		const Email = req.body.Email;
		const jobID = req.body.jobID;
		const LanguageLvl = ["None", "A1", "A2", "B1", "B2", "C1", "C2"];
		const EnglishLvl = req.body.EnglishLvl;
		const ArabicLvl = req.body.ArabicLvl;
		if (EnglishLvl) {
			if (!LanguageLvl.includes(EnglishLvl)) {
				throw new Error("Incorrect Language Level input!");
			}
		}
		if (ArabicLvl) {
			if (!LanguageLvl.includes(ArabicLvl)) {
				throw new Error("Incorrect Language Level input!");
			}
		}
		if (YearsOfExp < 0) {
			throw new Error("Years of Exoerience Cannont be less Than Zero!");
		}
		const Applications = await prisma.applicantion.findMany({
			where: {
				Applicant: {
					Email,
				},
			},
		});
		let AppliedJobs = [];
		Applications.map((application) => {
			AppliedJobs.push(application.jobsId);
		});
		if (AppliedJobs.includes(jobID)) {
			throw new Error("Already Applied with this Job!");
		}
		if (Applications.length >= 2) {
			throw new Error("Already Applied with this email!");
		}
		next();
	} catch (error) {
		return res.status(409).send(error.message);
	}
};

module.exports = {
	saveApplicantion,
};
