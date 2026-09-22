const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", requireAuth, listTasks);
router.get("/:id", requireAuth, getTask);

router.post(
  "/",
  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("projectId").isUUID().withMessage("A valid projectId is required"),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("status").optional().isIn(["todo", "in-progress", "done"]),
    body("dueDate").optional().isISO8601(),
  ],
  validate,
  createTask
);

router.patch(
  "/:id",
  requireAuth,
  [
    body("title").optional().trim().notEmpty(),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("status").optional().isIn(["todo", "in-progress", "done"]),
    body("dueDate").optional().isISO8601(),
  ],
  validate,
  updateTask
);

router.patch(
  "/:id/status",
  requireAuth,
  [body("status").isIn(["todo", "in-progress", "done"]).withMessage("Invalid status")],
  validate,
  updateTaskStatus
);

router.delete("/:id", requireAuth, deleteTask);

module.exports = router;
