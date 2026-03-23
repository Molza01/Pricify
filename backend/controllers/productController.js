const Product = require("../models/Product");
const SearchQuery = require("../models/SearchQuery");
const { scrapeAmazon } = require("../services/amazonScraper");
const { scrapeFlipkart } = require("../services/flipkartScraper");
const { fetchFromAmazonAPI, fetchFromFlipkartAPI } = require("../services/apiService");
const { analyzePrices } = require("../services/priceAnalysis");

/**
 * GET /api/search-product?q=<query>
 * Search for a product across Amazon and Flipkart.
 * Uses Puppeteer scraping first, falls back to APIs if scraping fails.
 */
async function searchProduct(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const query = q.trim().toLowerCase();

    // Check if we have recent cached results (< 1 hour old)
    const cached = await Product.findOne({
      query,
      lastUpdated: { $gte: new Date(Date.now() - 3600000) },
    });

    if (cached) {
      // Log the search query
      await SearchQuery.create({ query, resultCount: cached.prices.length });
      return res.json({
        success: true,
        fromCache: true,
        data: {
          query: cached.query,
          prices: cached.prices,
          analysis: cached.analysis,
          lastUpdated: cached.lastUpdated,
        },
      });
    }

    // Scrape from both sources in parallel
    console.log(`Scraping prices for: "${query}"`);
    let [amazonResults, flipkartResults] = await Promise.all([
      scrapeAmazon(query),
      scrapeFlipkart(query),
    ]);

    // Fallback to APIs if scraping returned no results
    if (amazonResults.length === 0) {
      console.log("Amazon scraping failed, falling back to API...");
      amazonResults = await fetchFromAmazonAPI(query);
    }

    if (flipkartResults.length === 0) {
      console.log("Flipkart scraping failed, falling back to API...");
      flipkartResults = await fetchFromFlipkartAPI(query);
    }

    const allPrices = [...amazonResults, ...flipkartResults];

    if (allPrices.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No products found. Try a different search term.",
      });
    }

    // Analyze prices
    const analysis = analyzePrices(allPrices);

    // Cache results in database
    await Product.findOneAndUpdate(
      { query },
      { query, prices: allPrices, analysis, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    // Log search query
    await SearchQuery.create({ query, resultCount: allPrices.length });

    res.json({
      success: true,
      fromCache: false,
      data: {
        query,
        prices: allPrices,
        analysis,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

/**
 * GET /api/price-analysis?q=<query>
 * Get price analysis for a previously searched product.
 */
async function getPriceAnalysis(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const product = await Product.findOne({ query: q.trim().toLowerCase() });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found. Search for it first.",
      });
    }

    res.json({
      success: true,
      data: {
        query: product.query,
        analysis: product.analysis,
        lastUpdated: product.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

/**
 * POST /api/save-product
 * Save a product to the shopkeeper's frequently searched list.
 * Body: { query, suggestedPrice }
 */
async function saveProduct(req, res) {
  try {
    const { query, suggestedPrice } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Product query is required" });
    }

    const product = await Product.findOne({ query: query.trim().toLowerCase() });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found. Search for it first.",
      });
    }

    // Update suggested price if provided
    if (suggestedPrice) {
      product.analysis.suggestedPrice = suggestedPrice;
      await product.save();
    }

    res.json({
      success: true,
      message: "Product saved successfully",
      data: {
        query: product.query,
        analysis: product.analysis,
      },
    });
  } catch (error) {
    console.error("Save error:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

/**
 * GET /api/popular-searches
 * Get the most popular search queries.
 */
async function getPopularSearches(req, res) {
  try {
    const popular = await SearchQuery.aggregate([
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: popular.map((p) => ({ query: p._id, count: p.count })),
    });
  } catch (error) {
    console.error("Popular searches error:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

module.exports = {
  searchProduct,
  getPriceAnalysis,
  saveProduct,
  getPopularSearches,
};
