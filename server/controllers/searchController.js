const SearchJob = require("../models/SearchJob");
const countryConfig = require("../config/countryConfig");

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
    const searchJobs = await SearchJob.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

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

module.exports = {
  createSearchJob,
  getMySearchJobs,
};