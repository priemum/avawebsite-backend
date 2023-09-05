const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const userRouter = require("./routes/api/UserRoute");
const roleRouter = require("./routes/api/RoleRoute");
const resourceRouter = require("./routes/api/ResourcesRoute");
const teamRouter = require("./routes/api/TeamRoute");
const port = process.env.PORT || 3500;
const app = express();

//middleware
// app.use(credentials);
// app.use(cookieParser());
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//serve static files
// console.log(path.join(__dirname, "/public"));
app.use("/public", express.static(path.join(__dirname, "/public")));

app.use("/", userRouter);
app.use("/", roleRouter);
app.use("/", resourceRouter);
app.use("/", teamRouter);
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
