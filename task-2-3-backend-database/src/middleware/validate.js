const { validationResult } = require("express-validator");
const { ApiError } = require("./errorHandler");

// Runs after express-validator's chain of checks() on a route; converts
// any failures into a consistent 400 response via the central error handler.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        400,
        "Validation failed",
        errors.array().map((e) => ({ field: e.path, message: e.msg }))
      )
    );
  }
  next();
}

module.exports = { validate };
