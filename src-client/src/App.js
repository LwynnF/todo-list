import react from "react";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
	const apiUrl = process.env.REACT_APP_API_URL;
	return (
		<div className="App">
			<header className="App-header">
				<TodoList />
			</header>
		</div>
	);
}

export default App;
