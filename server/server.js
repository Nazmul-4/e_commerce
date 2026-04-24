const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); // ✅ COOKIE PART: import cookie-parser

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const searchRoutes = require("./routes/searchRoutes");

// Connect DB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // ✅ COOKIE PART: allow browser to send cookies
  })
);

app.use(express.json());

// ✅ COOKIE PART START
app.use(cookieParser());
// ✅ COOKIE PART END

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E_Commerce server is running successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});