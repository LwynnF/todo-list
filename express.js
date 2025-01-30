const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 4000;

// Enable CORS
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));


// Initialise Sequelize(PostgreSQL connection)
const sequelize = new Sequelize("todos", "postgres", "postdb", {
	host: "localhost",
	dialect: "postgres",
});

// Define the todo model
const Todo = sequelize.define("Todos", {
	task: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isCompleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

// Middleware to parse JSON bodies
app.use(express.json());

// Test connection and sync models
sequelize
	.authenticate()
	.then(() => {
		console.log("Connected to PostgreSQL");
		return sequelize.sync();
	})
	.catch((err) => console.error("Connection failed", err));

// API endpoints for CRUD operations

// Add (POST) new todo
app.post("/todos", async (req, res) => {
	try {
		console.log("Request body:", req.body);
		const todo = await Todo.create(req.body);
		res.status(201).json(todo);
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Read (GET) all todos
app.get("/todos", async (req, res) => {
	try {
		const todo = await Todo.findAll();
		res.status(200).json(todo);
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Update (PUT) existing todo
app.put("/todos/:id", async (req, res) => {
	try {
		const todo = await Todo.findByPk(req.params.id);
		if (!todo) return res.status(404).json({ error: "Todo not found" });

		await todo.update(req.body);
		res.json(todo);
	} catch (err) {
		res.status(404).json({ error: "Todo not found" });
	}
});

// Delete (DELETE) existing todo
app.delete("/todos/:id", async (req, res) => {
	try {
		const todo = await Todo.findByPk(req.params.id);
		if (!todo) return res.status(404).json({ error: "Todo not found" });

		await todo.destroy();
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
	res.json({ message: "Todo successfully deleted" });
});

// Start server

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
