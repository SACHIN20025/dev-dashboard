const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { ApiError } = require("../middleware/errorHandler");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({ name, email, passwordHash });

    // defaultScope (which excludes passwordHash) applies to finder methods,
    // not to the instance .create() returns — re-fetch to get a safe object.
    const user = await User.findByPk(created.id);
    const token = signToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken(user);
    const safeUser = await User.findByPk(user.id); // default scope strips passwordHash
    res.json({ success: true, data: { user: safeUser, token } });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
