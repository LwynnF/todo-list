const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
	process.env.DB_TABLE,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "postgres",
		port: process.env.DB_PORT,
	}
);

// Must match my db
const Todo = sequelize.define("Todos", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	task: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isCompleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.NOW,
	},
});

module.exports = { Todo, sequelize };
