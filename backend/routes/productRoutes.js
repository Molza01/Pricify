const express = require("express");
const router = express.Router();
const {
  searchProduct,
  getPriceAnalysis,
  saveProduct,
  getPopularSearches,
} = require("../controllers/productController");

// Search for a product and get prices from multiple sources
router.get("/search-product", searchProduct);

// Get price analysis for a previously searched product
router.get("/price-analysis", getPriceAnalysis);

// Save a product to favorites
router.post("/save-product", saveProduct);

// Get popular/trending searches
router.get("/popular-searches", getPopularSearches);

module.exports = router;
