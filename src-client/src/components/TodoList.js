import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoItem from "./TodoItem";
import Message from "./Message";
import ProgressIndicator from "./ProgressIndicator";
import "./TodoList.css";

// Manages state and renders list of todoitem components
function TodoList() {
	const [nextId, setNextId] = useState(1);
	const [editId, setEditId] = useState(null);
	const [todo, setTodo] = useState([]);
	const [todoItem, setTodoItem] = useState("");
	const [isButtonDisabled, setButtonDisabled] = useState(false);

	const apiUrl = process.env.REACT_APP_API_URL;
	console.log("API url:", process.env.REACT_APP_API_URL);
	console.log("All env variables:", process.env);

	if (!apiUrl) {
		console.error("API URL is not defined");
	}

	// Fetch todos from the backend when the component mounts
	useEffect(() => {
		async function fetchTodos() {
			try {
				const response = await axios.get(`${apiUrl}/todos`);
				setTodo(response.data);
			} catch (error) {
				console.error("Error fetching todos:", error);
			}
		}
		fetchTodos();
	}, [apiUrl]);

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
				const response = await axios.put(`${apiUrl}/todos/${editId}`, {
					task: todoItem,
				});
				setTodo(
					todo.map((task) =>
						task.id === editId ? { ...task, task: todoItem } : task
					)
				);
				setEditId(null);
				setTodoItem("");
			} catch (error) {
				console.error("Error updating todo:", error);
			}
		} else {
			try {
				const response = await axios.post(`${apiUrl}/todos`, {
					task: todoItem,
					isCompleted: false,
				});
				const newTodo = response.data;
				setTodo([...todo, newTodo]);
				setNextId(nextId + 1);
				setTodoItem("");
			} catch (error) {
				console.error("Error adding todo:", error);
			}
		}
	}

	async function toggleCompleted(id) {
		const updatedTodo = todo.find((task) => task.id === id);
		updatedTodo.isCompleted = !updatedTodo.isCompleted;

		try {
			await axios.put(`${apiUrl}/todos/${id}`, updatedTodo);
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
			await axios.delete(`${apiUrl}/todos/${id}`);
			setTodo(todo.filter((task) => task.id !== id));
		} catch (error) {
			console.error("Error deleting todo:", error);
		}
	}

	async function editTodo(id, task) {
		setEditId(id);
		setTodoItem(task);
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

export default TodoList;
