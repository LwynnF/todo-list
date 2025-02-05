const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Enabling CORS to allow requests from local host 3000
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

module.exports = app;
