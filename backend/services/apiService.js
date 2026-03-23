/**
 * Fallback API service for when Puppeteer scraping fails.
 * Returns demo data with proper product images when API keys are not configured.
 */

// Product image URLs mapped by category keywords
const PRODUCT_IMAGES = {
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
  television: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
  headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  earphone: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop",
  earbuds: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop",
  shoe: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  sneaker: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  shampoo: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=300&fit=crop",
  cream: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
  perfume: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
  speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
  bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  backpack: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  bottle: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
  book: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
  pen: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
  charger: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop",
  shirt: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop",
  tshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
  sunglasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  cold_drink: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
  soda: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
  chalk: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=400&h=300&fit=crop",
  notebook: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop";

// Brand/variant names per source for realistic titles
const AMAZON_BRANDS = ["AmazonBasics", "boAt", "Sony", "Samsung", "Realme", "HP", "Prestige", "Philips"];
const FLIPKART_BRANDS = ["MarQ", "SmartBuy", "Noise", "Redmi", "Motorola", "Lenovo", "Pigeon", "Crompton"];

function getImageForQuery(query) {
  const lower = query.toLowerCase();
  for (const [keyword, url] of Object.entries(PRODUCT_IMAGES)) {
    if (lower.includes(keyword.replace("_", " "))) return url;
  }
  return DEFAULT_IMAGE;
}

async function fetchFromAmazonAPI(query) {
  if (!process.env.AMAZON_API_KEY) {
    console.log("Amazon API key not configured, using demo data");
    return generateDemoData(query, "amazon");
  }
  return [];
}

async function fetchFromFlipkartAPI(query) {
  if (!process.env.FLIPKART_API_KEY) {
    console.log("Flipkart API key not configured, using demo data");
    return generateDemoData(query, "flipkart");
  }
  return [];
}

function generateDemoData(query, source) {
  const basePrice = getBasePrice(query);
  const products = [];
  const brands = source === "amazon" ? AMAZON_BRANDS : FLIPKART_BRANDS;
  const image = getImageForQuery(query);
  const platformName = source === "amazon" ? "Amazon" : "Flipkart";

  const variants = [
    "Premium Edition", "Standard Pack", "Value Pack", "Pro Series", "Lite Version"
  ];

  for (let i = 0; i < 5; i++) {
    const variation = 0.7 + Math.random() * 0.6;
    const price = Math.round(basePrice * variation);
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const rating = (3 + Math.random() * 2).toFixed(1);

    products.push({
      source,
      title: `${brand} ${capitalize(query)} - ${variants[i]}`,
      price,
      url: source === "amazon"
        ? `https://www.amazon.in/s?k=${encodeURIComponent(query)}`
        : `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
      image,
      rating: `${rating} out of 5 stars`,
    });
  }

  return products;
}

function getBasePrice(query) {
  const lower = query.toLowerCase();
  if (lower.includes("phone") || lower.includes("mobile")) return 15000;
  if (lower.includes("laptop")) return 45000;
  if (lower.includes("tv") || lower.includes("television")) return 25000;
  if (lower.includes("headphone") || lower.includes("earphone") || lower.includes("earbuds")) return 1500;
  if (lower.includes("shoe") || lower.includes("sneaker")) return 2000;
  if (lower.includes("watch")) return 3000;
  if (lower.includes("camera")) return 25000;
  if (lower.includes("speaker")) return 2000;
  if (lower.includes("keyboard")) return 1500;
  if (lower.includes("mouse")) return 800;
  if (lower.includes("shampoo")) return 350;
  if (lower.includes("cream")) return 300;
  if (lower.includes("perfume")) return 1200;
  if (lower.includes("cold drink") || lower.includes("soda")) return 40;
  if (lower.includes("chalk")) return 60;
  if (lower.includes("pen") || lower.includes("pencil")) return 100;
  if (lower.includes("book") || lower.includes("notebook")) return 200;
  if (lower.includes("bag") || lower.includes("backpack")) return 1500;
  if (lower.includes("shirt") || lower.includes("tshirt")) return 600;
  if (lower.includes("jeans")) return 1200;
  if (lower.includes("sunglasses")) return 800;
  if (lower.includes("tablet")) return 15000;
  if (lower.includes("charger")) return 500;
  return 500;
}

function capitalize(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = { fetchFromAmazonAPI, fetchFromFlipkartAPI };
