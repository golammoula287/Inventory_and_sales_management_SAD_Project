const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const authenticateToken = require("../Middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getMe);

module.exports = router;
