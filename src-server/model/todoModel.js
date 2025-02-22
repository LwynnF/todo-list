const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
	process.env.PG_DB,
	process.env.PG_USER,
	process.env.PG_PASSWORD,
	{
		host: process.env.PG_HOST,
		dialect: "postgres",
		port: process.env.PG_PORT,
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
