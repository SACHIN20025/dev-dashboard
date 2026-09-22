// Centralized error handler — every controller forwards errors here via
// next(err) instead of formatting responses inline. Keeps status codes
// and error shapes consistent across the whole API.

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  // Sequelize validation / uniqueness errors -> 400
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : err.message;

  if (statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { errors: err.details } : {}),
  });
}

module.exports = { ApiError, notFoundHandler, errorHandler };
