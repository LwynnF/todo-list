const { Pool } = require("pg");
require("dotenv").config();

console.log("DEBUG: DB_NAME: ", process.env.DB_NAME);
console.log("DEBUG: DB_USER: ", process.env.DB_USER);
console.log("DEBUG: DB_HOST: ", process.env.DB_HOST);
console.log("DEBUG: DB_PASSWORD: ", process.env.DB_PASSWORD);
console.log("DEBUG: PORT: ", process.env.PORT);

const pool = new Pool({
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

module.exports = pool;
