const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { listUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");

router.get("/", requireAuth, listUsers);
router.get("/:id", requireAuth, getUser);

router.patch(
  "/:id",
  requireAuth,
  [body("name").optional().trim().notEmpty().withMessage("Name cannot be empty")],
  validate,
  updateUser
);

router.delete("/:id", requireAuth, deleteUser);

module.exports = router;
