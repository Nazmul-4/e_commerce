const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password, country } = req.body;

    // Check all fields
    if (!name || !email || !password || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check valid country
    const allowedCountries = ["BD", "IN", "CN"];
    if (!allowedCountries.includes(country)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country selected",
      });
    }

    // Check user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      country,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Current logged-in user controller
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
      error: error.message,
    });
  }
};

// Test controller
const testAuth = (req, res) => {
  res.json({
    success: true,
    message: "Auth route working",
  });
};

module.exports = {
  testAuth,
  registerUser,
  loginUser,
  getMe,
};

