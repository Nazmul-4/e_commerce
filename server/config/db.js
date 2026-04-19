const mongoose = require("mongoose");//connect to mongodb database

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);//reads from .env file

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;