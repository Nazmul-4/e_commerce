const User = require("../models/User");

// Test controller
const testAuth = (req, res) => {
  res.json({
    success: true,
    message: "Auth route working",
  });
};

module.exports = {
  testAuth,
};