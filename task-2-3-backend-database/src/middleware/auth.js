const jwt = require("jsonwebtoken");
const { ApiError } = require("./errorHandler");

// Protects routes by requiring a valid "Authorization: Bearer <token>" header.
// Used for every write operation and for Task 4's protected-route requirement.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Missing or malformed Authorization header"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = { requireAuth };
