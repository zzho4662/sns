const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const users = require("./routes/users");

const app = express();

app.use(express.json());

app.use("/api/v1/users", users);

const PORT = process.env.PORT || 6100;

app.listen(PORT, console.log("6100"));
