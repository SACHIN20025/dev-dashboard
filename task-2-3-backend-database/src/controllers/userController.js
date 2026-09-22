const { User } = require("../models");
const { ApiError } = require("../middleware/errorHandler");

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({ order: [["createdAt", "ASC"]] });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    if (req.user.id !== user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You can only update your own profile");
    }

    const { name, role } = req.body;
    if (name !== undefined) user.name = name;
    if (role !== undefined && req.user.role === "admin") user.role = role;
    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    if (req.user.id !== user.id && req.user.role !== "admin") {
      throw new ApiError(403, "You can only delete your own account");
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, updateUser, deleteUser };
