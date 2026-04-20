const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    priceText: {
      type: String,
      default: "",
    },
    priceValue: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    sourceSite: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      enum: ["BD", "IN", "CN"],
      required: true,
    },
    productUrl: {
      type: String,
      required: true,
      unique: true,
    },
    keyword: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    searchJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SearchJob",
      default: null,
    },
    collectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);