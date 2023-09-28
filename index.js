const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const userRouter = require("./routes/api/UserRoute");
const roleRouter = require("./routes/api/RoleRoute");
const resourceRouter = require("./routes/api/ResourcesRoute");
const teamRouter = require("./routes/api/TeamRoute");
const AuthRouter = require("./routes/api/AuthRoute");
const credentials = require("./middlewares/credentials");
const roleResourceRouter = require("./routes/api/RoleResourcesRoute");
const languageRouter = require("./routes/api/LanguageRouter");
const articleRouter = require("./routes/api/ArticlesRoute");
const corsOptions = require("./config/corsOptions");
const addressRouter = require("./routes/api/AddressRoute");
const unitRouter = require("./routes/api/UnitRoute");
const currencyRouter = require("./routes/api/CurrencyRoute");
const developerRouter = require("./routes/api/developerRoute");
const categoryRouter = require("./routes/api/CategoryRoute");
const announcementRouter = require("./routes/api/AnnouncementRoute");
const port = process.env.PORT || 3500;
const app = express();

//middleware
app.use(credentials);
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//serve static files
// console.log(path.join(__dirname, "/public"));
app.use("/public", express.static(path.join(__dirname, "/public")));

app.use("/", AuthRouter);
app.use("/", userRouter);
app.use("/", roleRouter);
app.use("/", resourceRouter);
app.use("/", teamRouter);
app.use("/", roleResourceRouter);
app.use("/", languageRouter);
app.use("/", articleRouter);
app.use("/", addressRouter);
app.use("/", unitRouter);
app.use("/", currencyRouter);
app.use("/", developerRouter);
app.use("/", categoryRouter);
app.use("/", announcementRouter);
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
