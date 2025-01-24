import React from "react";
import "./Message.css";
import hooray from "../assets/hooray.gif";
import todo from "../assets/todo.gif";
import working from "../assets/working.gif";
import list from "../assets/list.gif"

function Message({ completedTodos, totalTodos }) {
	let message = "";
	let gif = "";

	switch (true) {
		case totalTodos === 0:
			message = "No tasks, get adding!";
			gif = list;
			break;

		case completedTodos === totalTodos && totalTodos > 0:
			message = "Hooray you've completed all tasks!";
			gif = hooray;
			break;

    case completedTodos > 0 && totalTodos > 1:
      message = "In progress, keep going!"
      gif = working;
      break;

		case completedTodos === 0 && totalTodos > 0:
      message = "Better get started!"
      gif = todo;
			break;
	}

	return (
		<div>
			<h2>{message} </h2>
			<img
				src={
					gif
				}
				alt="status gif"
				className="status gif"
			/>
		</div>
	);
}

export default Message;
