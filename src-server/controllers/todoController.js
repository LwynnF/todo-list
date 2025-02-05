const Todo = require("../model/todoModel");

// API endpoints for CRUD operations

// Add (POST) new todo
const createTodo = async (req, res) => {
	try {
		const todo = await Todo.create(req.body);
		res.status(201).json(todo);
	} catch (err) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Read (GET) all todos
const getAllTodos = async (req, res) => {
	try {
		const todo = await Todo.findAll();
		res.status(200).json(todo);
	} catch (err) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Edit (PUT) todo
const updateTodo = async (req, res) => {
	try {
		const todo = await Todo.findByPk(req.params.id);
		if (!todo) return res.status(404).json({ error: "Todo not found" });

		await todo.update(req.body);
		res.json(todo);
	} catch (err) {
		res.status(404).json({ error: "Todo not found" });
	}
};

// Delete todo
const deleteTodo = async (req, res) => {
	try {
		const todo = await Todo.findByPk(req.params.id);
		if (!todo) return res.status(404).json({ error: "Todo not found" });

		await todo.destroy();
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	createTodo,
	getAllTodos,
	updateTodo,
	deleteTodo,
};
