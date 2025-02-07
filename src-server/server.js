require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 4000;

// Persists app.js on port 4000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
