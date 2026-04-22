const SearchJob = require("../models/SearchJob");
const Product = require("../models/Product");
const countryConfig = require("../config/countryConfig");
const generateMockProducts = require("../utils/mockProducts");
const calculateScore = require("../utils/calculateScore");

// Create a new search job
const createSearchJob = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required",
      });
    }

    const userCountry = req.user.country;
    const config = countryConfig[userCountry];

    if (!config) {
      return res.status(400).json({
        success: false,
        message: "Invalid user country",
      });
    }

    const searchJob = await SearchJob.create({
      userId: req.user._id,
      keyword: keyword.trim(),
      country: userCountry,
      currency: config.currency,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Search job created successfully",
      searchJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create search job",
      error: error.message,
    });
  }
};

// Get all search jobs for logged-in user
const getMySearchJobs = async (req, res) => {
  try {
    const searchJobs = await SearchJob.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Search history fetched successfully",
      total: searchJobs.length,
      searchJobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
      error: error.message,
    });
  }
};

// Generate mock products for a search job
const generateSearchProducts = async (req, res) => {
  try {
    const { jobId } = req.params;

    const searchJob = await SearchJob.findOne({
      _id: jobId,
      userId: req.user._id,
    });

    if (!searchJob) {
      return res.status(404).json({
        success: false,
        message: "Search job not found",
      });
    }

    searchJob.status = "running";
    await searchJob.save();

    await Product.deleteMany({ searchJobId: searchJob._id });

    const mockProducts = generateMockProducts({
      keyword: searchJob.keyword,
      country: searchJob.country,
      searchJobId: searchJob._id,
    });

    const productsWithScore = mockProducts.map((product) => ({
      ...product,
      score: calculateScore(product),
    }));

    const savedProducts = await Product.insertMany(productsWithScore);

    searchJob.totalUrlsFound = savedProducts.length;
    searchJob.totalProductsSaved = savedProducts.length;
    searchJob.status = "completed";
    await searchJob.save();

    return res.status(201).json({
      success: true,
      message: "Mock products generated successfully",
      totalProducts: savedProducts.length,
      products: savedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate products",
      error: error.message,
    });
  }
};

// Get products by search job
const getProductsBySearchJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const searchJob = await SearchJob.findOne({
      _id: jobId,
      userId: req.user._id,
    });

    if (!searchJob) {
      return res.status(404).json({
        success: false,
        message: "Search job not found",
      });
    }

    const products = await Product.find({ searchJobId: jobId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      total: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get top ranked products by search job
const getTopProductsBySearchJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const searchJob = await SearchJob.findOne({
      _id: jobId,
      userId: req.user._id,
    });

    if (!searchJob) {
      return res.status(404).json({
        success: false,
        message: "Search job not found",
      });
    }

    const topProducts = await Product.find({ searchJobId: jobId })
      .sort({ score: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Top products fetched successfully",
      total: topProducts.length,
      topProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
      error: error.message,
    });
  }
};

module.exports = {
  createSearchJob,
  getMySearchJobs,
  generateSearchProducts,
  getProductsBySearchJob,
  getTopProductsBySearchJob,
};