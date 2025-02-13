require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 5000;

// Persists app.js on port 5000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
