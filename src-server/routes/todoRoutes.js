const express = require("express");
const router = express.Router();

const {
	createTodo,
	getAllTodos,
	updateTodo,
	deleteTodo,
} = require("../controllers/todoController");

// Define routes and associated controller function
router.post("/todos", createTodo);
router.get("/todos", getAllTodos);
router.put("/todos", updateTodo);
router.delete("/todos", deleteTodo);

module.exports = router;
