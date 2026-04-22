const express = require("express");
const router = express.Router();

const {
  createSearchJob,
  getMySearchJobs,
  generateSearchProducts,
  getProductsBySearchJob,
  getTopProductsBySearchJob,
  downloadTopProductsReport,
} = require("../controllers/searchController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSearchJob);
router.get("/my-history", protect, getMySearchJobs);
router.post("/:jobId/generate-products", protect, generateSearchProducts);
router.get("/:jobId/products", protect, getProductsBySearchJob);
router.get("/:jobId/top-products", protect, getTopProductsBySearchJob);
router.get("/:jobId/download-report", protect, downloadTopProductsReport);

module.exports = router;