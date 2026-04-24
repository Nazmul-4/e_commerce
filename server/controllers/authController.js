const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ✅ COOKIE PART START
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};
// ✅ COOKIE PART END

// Register controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password, country, avatar } = req.body;

    if (!name || !email || !password || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const allowedCountries = ["BD", "IN", "CN"];
    if (!allowedCountries.includes(country)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country selected",
      });
    }

    // prevent duplicate registration with the same email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      country,
      avatar: avatar || "",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        avatar: user.avatar,
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate a JWT token for the authenticated user
    const token = generateToken(user);

    // ✅ COOKIE PART START
    res.cookie("token", token, getCookieOptions());
    // ✅ COOKIE PART END

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        avatar: user.avatar,
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

// ✅ COOKIE PART START
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
// ✅ COOKIE PART END

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
  logoutUser,
  getMe,
};