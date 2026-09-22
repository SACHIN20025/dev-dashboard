const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { generateTasks, summarizeProjectTasks } = require("../controllers/aiController");

router.post(
  "/generate-tasks",
  requireAuth,
  [body("description").trim().isLength({ min: 5 }).withMessage("description is required (min 5 characters)")],
  validate,
  generateTasks
);

router.get("/projects/:projectId/summary", requireAuth, summarizeProjectTasks);

module.exports = router;
