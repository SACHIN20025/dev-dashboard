const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");

// A user owns many projects; a project belongs to one owner.
User.hasMany(Project, { foreignKey: "ownerId", as: "projects", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// A project has many tasks; a task belongs to one project.
Project.hasMany(Task, { foreignKey: "projectId", as: "tasks", onDelete: "CASCADE" });
Task.belongsTo(Project, { foreignKey: "projectId", as: "project" });

// A user can be assigned many tasks; a task has one assignee (optional).
User.hasMany(Task, { foreignKey: "assigneeId", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assigneeId", as: "assignee" });

module.exports = { User, Project, Task };
