const express = require("express");
const router = express.Router();

const {
  createSearchJob,
  getMySearchJobs,
} = require("../controllers/searchController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSearchJob);
router.get("/my-history", protect, getMySearchJobs);

module.exports = router;