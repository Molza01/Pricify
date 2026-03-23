/**
 * Price Analysis Engine
 * Calculates min, max, average, and suggests optimal selling price.
 */

/**
 * Analyze an array of price entries and return pricing insights.
 * @param {Array} prices - Array of { source, title, price, ... }
 * @returns {Object} Analysis with min, max, avg, suggested price
 */
function analyzePrices(prices) {
  if (!prices || prices.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
      suggestedPrice: 0,
      totalResults: 0,
      pricesBySource: {},
    };
  }

  const priceValues = prices.map((p) => p.price);

  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const avgPrice = Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length);

  // Suggested price: weighted average favoring the median range.
  // Strategy: slightly below average to stay competitive but above min to maintain profit.
  const suggestedPrice = calculateSuggestedPrice(priceValues);

  // Group prices by source for comparison
  const pricesBySource = {};
  prices.forEach((p) => {
    if (!pricesBySource[p.source]) {
      pricesBySource[p.source] = [];
    }
    pricesBySource[p.source].push(p.price);
  });

  // Calculate per-source averages
  const sourceAverages = {};
  for (const [source, srcPrices] of Object.entries(pricesBySource)) {
    sourceAverages[source] = Math.round(
      srcPrices.reduce((a, b) => a + b, 0) / srcPrices.length
    );
  }

  return {
    minPrice,
    maxPrice,
    avgPrice,
    suggestedPrice,
    totalResults: prices.length,
    pricesBySource: sourceAverages,
  };
}

/**
 * Calculate an optimal selling price using percentile-based approach.
 * Uses the 40th percentile — competitive yet profitable.
 */
function calculateSuggestedPrice(priceValues) {
  const sorted = [...priceValues].sort((a, b) => a - b);

  // Remove outliers (bottom 10% and top 10%) if enough data points
  let filtered = sorted;
  if (sorted.length >= 6) {
    const trimCount = Math.floor(sorted.length * 0.1);
    filtered = sorted.slice(trimCount, sorted.length - trimCount);
  }

  // Use the 40th percentile of filtered prices
  const index = Math.floor(filtered.length * 0.4);
  const percentilePrice = filtered[index];

  // Average the percentile price with the overall median for stability
  const median = filtered[Math.floor(filtered.length / 2)];
  const suggested = Math.round((percentilePrice + median) / 2);

  return suggested;
}

module.exports = { analyzePrices };
