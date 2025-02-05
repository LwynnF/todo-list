const express = require("express");
const router = express.Router();


const {
	createTodo,
	getAllTodos,
	updateTodo,
	deleteTodo,
} = require("../controllers/todoController");

// Define routes and associate them with controller functions
router.post("/todos", createTodo);
router.get("/todos", getAllTodos);
router.put("/todos/:id", updateTodo); // Added :id parameter
router.delete("/todos/:id", deleteTodo); // Added :id parameter

module.exports = router;

