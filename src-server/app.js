const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", todoRoutes);

sequelize
	.authenticate()
	.then(async () => {
		console.log("Connected to PostgreSQL");
		await sequelize.sync();
	})
	.catch((err) => console.error("Connection failed", err));

module.exports = app;
