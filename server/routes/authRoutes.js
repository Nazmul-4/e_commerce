const express = require("express");
const router = express.Router();

const {
  testAuth,
  registerUser,
  loginUser,
  logoutUser, // ✅ COOKIE PART: import logout
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/test", testAuth);
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ COOKIE PART START
router.post("/logout", logoutUser);
// ✅ COOKIE PART END

// Protected route
router.get("/me", protect, getMe);

module.exports = router;