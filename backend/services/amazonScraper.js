const puppeteer = require("puppeteer");

/**
 * Scrape product prices from Amazon India using Puppeteer.
 * Includes anti-detection measures for reliable scraping.
 */
async function scrapeAmazon(query) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-infobars",
        "--window-size=1920,1080",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    // Anti-detection: remove webdriver flag
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) =>
        parameters.name === "notifications"
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters);
    });

    // Set realistic viewport and user-agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // Set extra headers to look like a real browser
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 45000 });

    // Wait for product results to load
    await page.waitForSelector('[data-component-type="s-search-result"]', {
      timeout: 15000,
    }).catch(() => null);

    // Small delay to let lazy-loaded content appear
    await new Promise((r) => setTimeout(r, 2000));

    const products = await page.evaluate(() => {
      const items = [];
      const results = document.querySelectorAll(
        '[data-component-type="s-search-result"]'
      );

      results.forEach((el) => {
        // Skip sponsored/ad results
        if (el.querySelector('[data-component-type="sp-sponsored-result"]')) return;

        // Title: from h2 span (h2 may or may not wrap an <a>)
        const titleEl = el.querySelector("h2 span");
        const title = titleEl ? titleEl.textContent.trim() : null;

        // Try multiple price selectors
        const priceEl =
          el.querySelector(".a-price .a-offscreen") ||
          el.querySelector(".a-price-whole");
        let price = null;
        if (priceEl) {
          const priceText = priceEl.textContent.replace(/[^0-9.]/g, "");
          price = parseFloat(priceText);
        }

        // URL: try h2 > a first, then the product link near the title
        let url = null;
        const linkEl =
          el.querySelector("h2 a[href]") ||
          el.querySelector("a.s-line-clamp-2[href]") ||
          el.querySelector('a.a-link-normal[href*="/dp/"]') ||
          el.querySelector('a.a-link-normal[href*="/sspa/"]') ||
          el.querySelector("a.a-link-normal[href]:not([href='#']):not([href^='javascript'])");
        if (linkEl) {
          const href = linkEl.getAttribute("href");
          if (href && href !== "#" && !href.startsWith("javascript")) {
            url = href.startsWith("http") ? href : "https://www.amazon.in" + href;
          }
        }

        const imgEl = el.querySelector(".s-image");
        const image = imgEl ? imgEl.getAttribute("src") : null;

        const ratingEl = el.querySelector(".a-icon-alt");
        const rating = ratingEl ? ratingEl.textContent.trim() : null;

        if (title && price && price > 0) {
          items.push({ source: "amazon", title, price, url, image, rating });
        }
      });

      return items.slice(0, 10);
    });

    console.log(`Amazon: found ${products.length} products for "${query}"`);
    return products;
  } catch (error) {
    console.error("Amazon scraping failed:", error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeAmazon };
