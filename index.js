const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 3500;
const app = express();
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
