import React, { useState } from "react";
import TodoItem from "./TodoItem";
import Message from "./Message";
import ProgressIndicator from "./ProgressIndicator";
import "./TodoList.css";

// Manages state and renders list of todoitem components
function ToDoList() {
	const [nextId, setNextId] = useState(1);
	const [editId, setEditId] = useState(null);
	const [todo, setTodo] = useState([]);
	const [todoItem, setTodoItem] = useState("");
	const [isButtonDisabled, setButtonDisabled] = useState(false);

	// Calculating the no. completed tasks for progress indicator
	const completedTodos = todo.filter((task) => task.isCompleted).length;
	const totalTodos = todo.length;

	const completedPercentage =
		totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
	console.log(completedPercentage);

	function addTodo() {
		if (todoItem.trim() === "") {
			alert("Please enter a task before adding")
			return;
		};
		// If editId is not null, then we are editing an existing task
		if (editId !== null) {
			setTodo(
				todo.map((task) =>
					task.id === editId ? { ...task, task: todoItem } : task
				)
			);
			setEditId(null); // Reset editId to null
			setTodoItem(""); // Clear the input field
			return; // Exit the function to prevent adding a new item
		}

		// Otherwise add a new task
		const newTodo = {
			id: nextId,
			task: todoItem,
			isCompleted: false,
		};
		setTodo([...todo, newTodo]);
		setNextId(nextId + 1);
		setTodoItem(""); // Clear the input field
	}

	function validateInput(e) {
		const value = e.target.value;
		setTodoItem(value);
		setButtonDisabled(value.trim() === "");
	}

	function deleteTodo(id) {
		setTodo(todo.filter((task) => task.id !== id));
	}

	function editTodo(id, task) {
		setEditId(id); // Set the id of the item being edited
		setTodoItem(task); // Set the current task value to the input field
	}

	function toggleCompleted(id) {
		setTodo(
			todo.map((task) => {
				if (task.id === id) {
					return { ...task, isCompleted: !task.isCompleted }; // Sets isCompleted to the opposite of what it currently is
				} else {
					return task;
				}
			})
		);
	}

	return (
		<div className="todo-list">
			<h1>To do list</h1>
			<div className="input-button-container">
				<input
					type="text"
					value={todoItem}
					onChange={validateInput}
					placeholder="Add your todo here"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !isButtonDisabled) addTodo();
					}}
				/>
				<button
					className="add"
					onClick={addTodo}
					disabled={isButtonDisabled}
				>
					+
				</button>
			</div>
			<div className="todo-items-container">
				<ProgressIndicator
					completedPercentage={completedPercentage}
					completedTodos={completedTodos}
					totalTodos={totalTodos}
				/>

				{todo.map((task) => (
					<TodoItem
						key={task.id}
						task={task}
						deleteTodo={deleteTodo}
						editTodo={editTodo}
						toggleCompleted={toggleCompleted}
					/>
				))}

				<Message
					completedTodos={completedTodos}
					totalTodos={totalTodos}
				/>
			</div>
		</div>
	);
}
export default ToDoList;
