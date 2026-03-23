const mongoose = require("mongoose");

// Schema for individual price entries from different sources
const priceEntrySchema = new mongoose.Schema({
  source: { type: String, required: true }, // "amazon" or "flipkart"
  title: { type: String, required: true },
  price: { type: Number, required: true },
  url: { type: String },
  image: { type: String },
  rating: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, index: true },
    prices: [priceEntrySchema],
    analysis: {
      minPrice: Number,
      maxPrice: Number,
      avgPrice: Number,
      suggestedPrice: Number,
      totalResults: Number,
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-expire cached results after 24 hours
productSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Product", productSchema);
