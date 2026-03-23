const mongoose = require("mongoose");

const searchQuerySchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    resultCount: { type: Number, default: 0 },
    searchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for analytics on popular searches
searchQuerySchema.index({ query: 1 });

module.exports = mongoose.model("SearchQuery", searchQuerySchema);
