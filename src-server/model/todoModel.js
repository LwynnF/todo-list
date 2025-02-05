const { Sequelize, DataTypes } = require("sequelize");

const Todo = Sequelize.afterDefine("Todos", {
  task: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
})
