const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", requireAuth, listProjects);
router.get("/:id", requireAuth, getProject);

router.post(
  "/",
  requireAuth,
  [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("status").optional().isIn(["on-track", "at-risk", "completed"]),
    body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid date"),
  ],
  validate,
  createProject
);

router.patch(
  "/:id",
  requireAuth,
  [
    body("name").optional().trim().notEmpty(),
    body("status").optional().isIn(["on-track", "at-risk", "completed"]),
    body("dueDate").optional().isISO8601(),
  ],
  validate,
  updateProject
);

router.delete("/:id", requireAuth, deleteProject);

module.exports = router;
