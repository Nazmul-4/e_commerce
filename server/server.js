const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
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
    credentials: true,
  })
);

app.use(express.json());
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



//jkCstNHu8PAisHZk ==> mongodb password

// mongodb+srv://ecommerceDB:1YOUR_PASSWORD@cluster0.k3pfbxf.mongodb.net/?appName=Cluster0

