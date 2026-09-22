const { Op } = require("sequelize");
const { Task, Project, User } = require("../models");
const { ApiError } = require("../middleware/errorHandler");

async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assigneeId,
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks?status=&priority=&projectId=&search=
async function listTasks(req, res, next) {
  try {
    const { status, priority, projectId, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectId) where.projectId = projectId;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, as: "project", attributes: ["id", "name"] },
        { model: User, as: "assignee", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: "project", attributes: ["id", "name"] },
        { model: User, as: "assignee", attributes: ["id", "name"] },
      ],
    });
    if (!task) throw new ApiError(404, "Task not found");
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");

    const { title, description, status, priority, dueDate, assigneeId } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assigneeId !== undefined) task.assigneeId = assigneeId;
    await task.save();

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/tasks/:id/status  { status: "todo" | "in-progress" | "done" }
async function updateTaskStatus(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");

    const { status } = req.body;
    if (!["todo", "in-progress", "done"].includes(status)) {
      throw new ApiError(400, "status must be one of: todo, in-progress, done");
    }

    task.status = status;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");
    await task.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createTask, listTasks, getTask, updateTask, updateTaskStatus, deleteTask };
