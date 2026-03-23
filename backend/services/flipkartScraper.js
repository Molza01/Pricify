const puppeteer = require("puppeteer");

/**
 * Scrape product prices from Flipkart using Puppeteer.
 * Uses dynamic class detection since Flipkart changes class names frequently.
 */
async function scrapeFlipkart(query) {
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

    // Anti-detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    });

    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 45000 });

    // Close login popup
    await page.keyboard.press("Escape").catch(() => {});
    await new Promise((r) => setTimeout(r, 1000));

    // Wait for product cards
    await page.waitForSelector("[data-id]", { timeout: 15000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 2000));

    const products = await page.evaluate(() => {
      const items = [];
      const cards = document.querySelectorAll("[data-id]");

      cards.forEach((card) => {
        // Title: get from <a title="..."> attribute
        const titleEl = card.querySelector("a[title]");
        const title = titleEl ? titleEl.getAttribute("title") : null;

        // Price: find divs containing the rupee symbol (₹) as leaf nodes
        // The selling price is typically the smaller number
        let price = null;
        const allEls = card.querySelectorAll("div, span");
        const prices = [];
        allEls.forEach((el) => {
          if (el.children.length === 0 && el.textContent.includes("\u20B9")) {
            const num = parseFloat(el.textContent.replace(/[^0-9.]/g, ""));
            if (num > 0) prices.push(num);
          }
        });
        // Selling price is usually the lowest among found prices
        if (prices.length > 0) {
          price = Math.min(...prices);
        }

        // URL
        const linkEl = card.querySelector('a[href*="/p/"]') || card.querySelector("a[href]");
        const href = linkEl ? linkEl.getAttribute("href") : null;
        const url = href
          ? (href.startsWith("http") ? href : "https://www.flipkart.com" + href)
          : null;

        // Image: look for product images from Flipkart CDN
        const imgEl = card.querySelector('img[src*="rukminim"]') || card.querySelector("img[src^='http']");
        const image = imgEl ? imgEl.getAttribute("src") : null;

        // Rating: find small text that looks like a rating number (e.g. "4.3")
        let rating = null;
        const ratingEl = card.querySelector('div[class*="XQDdHH"]');
        if (ratingEl) {
          rating = ratingEl.textContent.trim() + " out of 5";
        } else {
          // Fallback: look for star icon SVG siblings
          const svgStar = card.querySelector('img[src*="star"]') || card.querySelector('img[class*="PZfbSE"]');
          if (svgStar && svgStar.parentElement) {
            const rText = svgStar.parentElement.textContent.trim();
            if (rText.match(/^[1-5]\.?[0-9]?$/)) {
              rating = rText + " out of 5";
            }
          }
        }

        if (title && title.length > 3 && price && price > 0) {
          items.push({ source: "flipkart", title, price, url, image, rating });
        }
      });

      return items.slice(0, 10);
    });

    console.log(`Flipkart: found ${products.length} products for "${query}"`);
    return products;
  } catch (error) {
    console.error("Flipkart scraping failed:", error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeFlipkart };
