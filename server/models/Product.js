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
      required: true,
    },

    priceValue: {
      type: Number,
      required: true,
      default: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "BDT",
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
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    keyword: {
      type: String,
      required: true,
      trim: true,
    },

    productUrl: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    searchJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SearchJob",
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      default: "",
    },

    shortSpecs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);