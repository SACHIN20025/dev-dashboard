const { Project, Task, User } = require("../models");
const { ApiError } = require("../middleware/errorHandler");

async function createProject(req, res, next) {
  try {
    const { name, description, dueDate, status } = req.body;
    const project = await Project.create({
      name,
      description,
      dueDate,
      status,
      ownerId: req.user.id,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

async function listProjects(req, res, next) {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;

    const projects = await Project.findAll({
      where,
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
        { model: Task, as: "tasks", attributes: ["id", "status"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const filtered = search
      ? projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      : projects;

    // Attach a lightweight progress summary per project (done tasks / total tasks)
    const withProgress = filtered.map((p) => {
      const json = p.toJSON();
      const total = json.tasks.length;
      const done = json.tasks.filter((t) => t.status === "done").length;
      json.progress = total === 0 ? 0 : Math.round((done / total) * 100);
      json.taskCount = total;
      return json;
    });

    res.json({ success: true, data: withProgress });
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
        { model: Task, as: "tasks" },
      ],
    });
    if (!project) throw new ApiError(404, "Project not found");
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.ownerId !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You do not have permission to edit this project");
    }

    const { name, description, status, dueDate } = req.body;
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (dueDate !== undefined) project.dueDate = dueDate;
    await project.save();

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.ownerId !== req.user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You do not have permission to delete this project");
    }

    await project.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };
