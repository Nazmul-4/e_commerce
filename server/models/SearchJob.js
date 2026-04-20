const mongoose = require("mongoose");

const searchJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      enum: ["BD", "IN", "CN"],
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    totalUrlsFound: {
      type: Number,
      default: 0,
    },
    totalProductsSaved: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SearchJob", searchJobSchema);