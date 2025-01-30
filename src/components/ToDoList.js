import React, { useState, useEffect } from "react";
import axios from "axios";
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

	// Fetch todos from the backend when the component mounts
	useEffect(() => {
		async function fetchTodos() {
			try {
				const response = await axios.get("http://localhost:4000/todos");
				setTodo(response.data);
			} catch (error) {
				console.error("Error fetching todos:", error);
			}
		}
		fetchTodos();
	}, []);

	// Calculating the no. completed tasks for progress indicator
	const completedTodos = todo.filter((task) => task.isCompleted).length;
	const totalTodos = todo.length;

	const completedPercentage =
		totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
	console.log(completedPercentage);

	async function addTodo() {
		if (todoItem.trim() === "") {
			alert("Please enter a task before adding");
			return;
		}

		// If editId is not null, then we are editing an existing task
		if (editId !== null) {
			try {
				const response = await axios.put(
					`http://localhost:4000/todos/${editId}`,
					{
						task: todoItem,
					}
				);
				setTodo(
					todo.map((task) =>
						task.id === editId ? { ...task, task: todoItem } : task
					)
				);
				setEditId(null); // Reset editId to null
				setTodoItem(""); // Clear the input field
			} catch (error) {
				console.error("Error updating todo:", error);
			}
			return; // Exit the function to prevent adding a new item
		}

		try {
			const response = await axios.post("http://localhost:4000/todos", {
				task: todoItem,
				isCompleted: false,
			});
			const newTodo = response.data;
			setTodo([...todo, newTodo]);
			setNextId(nextId + 1);
			setTodoItem(""); // Clear the input field
		} catch (error) {
			console.error("Error adding todo:", error);
		}
	}

	async function toggleCompleted(id) {
		const updatedTodo = todo.find((task) => task.id === id);
		updatedTodo.isCompleted = !updatedTodo.isCompleted;

		try {
			await axios.put(`http://localhost:4000/todos/${id}`, updatedTodo);
			setTodo(
				todo.map((task) =>
					task.id === id
						? { ...task, isCompleted: updatedTodo.isCompleted }
						: task
				)
			);
		} catch (error) {
			console.error("Error updating todo:", error);
		}
	}

	function validateInput(e) {
		const value = e.target.value;
		setTodoItem(value);
		setButtonDisabled(value.trim() === "");
	}

	async function deleteTodo(id) {
		try {
			await axios.delete(`http://localhost:4000/todos/${id}`);
			setTodo(todo.filter((task) => task.id !== id));
		} catch (error) {
			console.error("Error deleting todo:", error);
		}
	}

	async function editTodo(id, task) {
		setEditId(id); // Set the id of the item being edited
		setTodoItem(task); // Set the current task value to the input field
	}

	return (
		<div className="todo-list">
			<h1>To Do List</h1>
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
