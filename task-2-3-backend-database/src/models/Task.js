const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Task title is required" }, len: [2, 160] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("todo", "in-progress", "done"),
      defaultValue: "todo",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Task;
