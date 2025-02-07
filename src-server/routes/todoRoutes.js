const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// Define routes and associate them with controller functions
router.get("/todos", todoController.getAllTodos);
router.get("/todos/:id", todoController.getTodo);
router.post("/todos", todoController.createTodo);
router.put("/todos/:id", todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);

// router.post("/todos", createTodo);
// router.get("/todos", getAllTodos);
// router.put("/todos/:id", updateTodo); // Added :id parameter
// router.delete("/todos/:id", deleteTodo); // Added :id parameter

module.exports = router;
