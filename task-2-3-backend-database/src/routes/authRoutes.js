const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { register, login, me } = require("../controllers/authController");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", requireAuth, me);

module.exports = router;
