const express = require("express");
const router = express.Router();

const {
  testAuth,
  registerUser,
  loginUser,
} = require("../controllers/authController");

// Test route
router.get("/test", testAuth);

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

module.exports = router;