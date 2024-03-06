const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const sendMail = async (FullName, Email, PhoneNo, Agent) => {
	let sent = false;
	let status = "";
	const __dirname = path.resolve();
	const transporter = nodemailer.createTransport({
		host: "mail.avarealestate.ae",
		port: 465,
		secure: true,
		auth: { user: process.env.Mail_USER, pass: process.env.PASSWORD },
	});
	transporter.use(
		"compile",
		hbs({
			viewEngine: "nodemailer-express-handlebars",
			viewPath: path.join(__dirname, "/views/"),
		}),
	);

	const mailOptions = {
		from: process.env.Mail_USER,
		to: Email,
		subject: "E-Invite for Open House - AVA Real Estate",
		template: "sample",
		context: {
			name: FullName,
			Agent: Agent,
			Email: Email,
		},
		attachments: [
			{
				filename: "ava-realestate-openhouse-invitation.pdf",
				path: "./public/ava-realestate-openhouse.pdf",
				contentType: "application/pdf",
			},
		],
	};
	const data = await transporter.sendMail(mailOptions);
	console.log("data: ", data);
	if (data.accepted != []) {
		console.log("Email sent " + data.response);
		sent = true;
		status = "Email was sent Successfully to " + Email;
	}
	return { sent, status };
};
module.exports = { sendMail };
