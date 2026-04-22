const express = require("express");
const router = express.Router();

const {
  createSearchJob,
  getMySearchJobs,
  generateSearchProducts,
  getProductsBySearchJob,
} = require("../controllers/searchController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSearchJob);
router.get("/my-history", protect, getMySearchJobs);
router.post("/:jobId/generate-products", protect, generateSearchProducts);
router.get("/:jobId/products", protect, getProductsBySearchJob);

module.exports = router;