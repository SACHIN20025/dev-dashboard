const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Project name is required" }, len: [2, 120] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("on-track", "at-risk", "completed"),
      defaultValue: "on-track",
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Project;
