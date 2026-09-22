const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Name is required" }, len: [2, 80] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "An account with this email already exists" },
      validate: { isEmail: { msg: "Must be a valid email address" } },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("member", "admin"),
      defaultValue: "member",
    },
  },
  {
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      withPassword: { attributes: {} },
    },
  }
);

module.exports = User;
