import React from "react";
import "./TodoItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function TodoItem({ task, toggleCompleted, deleteTodo, editTodo }) {
	function handleChange() {
		toggleCompleted(task.id);
	}

	return (
		<div className="todo-item-container">
			<div className="todo-item">
				<input
					className="checkbox"
					type="checkbox"
					aria-label="checkbox"
					checked={task.isCompleted}
					onChange={handleChange}
				/>
				<p className={task.isCompleted ? "checked" : ""}>{task.task}</p>
				<div>
					<button
						className="trash"
						aria-label="delete"
						onClick={() => deleteTodo(task.id)}
					>
						<FontAwesomeIcon icon={faTrash} />
					</button>

					<button
						className="edit"
						aria-label="edit"
						onClick={() => editTodo(task.id, task.task)}
					>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default TodoItem;
