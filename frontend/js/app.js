// ===== Configuration =====
const API_BASE = "/api";

// ===== Auth Guard =====
function isLoggedIn() {
  return !!localStorage.getItem("pricify_token");
}

function requireAuth() {
  if (!isLoggedIn()) {
    showAuthPrompt();
    return false;
  }
  return true;
}

function showAuthPrompt() {
  // Remove existing prompt if any
  const existing = document.getElementById("authPromptOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "authPromptOverlay";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  `;
  overlay.innerHTML = `
    <div style="
      background: white; border-radius: 20px; padding: 40px 36px;
      max-width: 400px; width: 90%; text-align: center;
      box-shadow: 0 25px 50px rgba(0,0,0,0.2);
      animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    ">
      <div style="
        width: 60px; height: 60px; margin: 0 auto 18px;
        background: linear-gradient(135deg, #4f46e5, #818cf8);
        border-radius: 50%; display: flex; align-items: center;
        justify-content: center; font-size: 1.6rem;
      ">&#128274;</div>
      <h3 style="font-size: 1.3rem; color: #0f172a; margin-bottom: 8px;">Login Required</h3>
      <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 24px; line-height: 1.5;">
        Please sign up or login to search products and access all features.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <a href="/auth.html" style="
          padding: 12px 28px; background: linear-gradient(135deg, #4f46e5, #3730a3);
          color: white; border-radius: 12px; text-decoration: none;
          font-weight: 600; font-size: 0.95rem; transition: transform 0.2s;
        ">Login / Sign Up</a>
        <button onclick="this.closest('#authPromptOverlay').remove()" style="
          padding: 12px 24px; background: #f1f5f9; border: none;
          border-radius: 12px; cursor: pointer; font-weight: 600;
          font-size: 0.95rem; color: #64748b; font-family: inherit;
        ">Cancel</button>
      </div>
    </div>
  `;

  // Add animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popUp { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `;
  overlay.appendChild(style);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// Product image mapping
const PRODUCT_IMAGES = {
  headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  earphone: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop",
  earbuds: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  shoe: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  sneaker: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
  bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  backpack: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  bottle: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
  shampoo: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=300&fit=crop",
  cream: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
  perfume: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
  sunglasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  book: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
  pen: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
  speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
  charger: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop",
  tshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
  shirt: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
  default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
};

// Category product suggestions
const CATEGORIES = {
  groceries: {
    label: "Groceries",
    items: ["Rice", "Atta", "Sugar", "Salt", "Oil", "Tea", "Coffee", "Biscuits", "Noodles", "Dal"],
  },
  cosmetics: {
    label: "Cosmetics",
    items: ["Shampoo", "Face Wash", "Cream", "Perfume", "Lipstick", "Sunscreen", "Hair Oil", "Body Lotion"],
  },
  stationery: {
    label: "Stationery",
    items: ["Pen", "Pencil", "Notebook", "Eraser", "Ruler", "Chalk", "Marker", "Glue Stick", "Geometry Box"],
  },
  electronics: {
    label: "Electronics",
    items: ["Headphones", "Charger", "Power Bank", "Mouse", "Keyboard", "Earbuds", "USB Cable", "Speaker"],
  },
  clothing: {
    label: "Clothing",
    items: ["T-Shirt", "Jeans", "Shirt", "Shoes", "Socks", "Belt", "Cap", "Jacket"],
  },
  household: {
    label: "Household",
    items: ["Soap", "Detergent", "Toothpaste", "Brush", "Mop", "Bucket", "Towel", "Bulb"],
  },
};

// Trending products for carousel
const TRENDING_PRODUCTS = [
  { name: "Wireless Headphones", price: 1499, source: "Amazon", image: PRODUCT_IMAGES.headphone },
  { name: "Running Shoes", price: 2199, source: "Flipkart", image: PRODUCT_IMAGES.shoe },
  { name: "Smart Watch", price: 3499, source: "Amazon", image: PRODUCT_IMAGES.watch },
  { name: "Laptop Stand", price: 899, source: "Flipkart", image: PRODUCT_IMAGES.laptop },
  { name: "Bluetooth Speaker", price: 1299, source: "Amazon", image: PRODUCT_IMAGES.speaker },
  { name: "Sunglasses", price: 799, source: "Flipkart", image: PRODUCT_IMAGES.sunglasses },
  { name: "Backpack", price: 1599, source: "Amazon", image: PRODUCT_IMAGES.backpack },
  { name: "Perfume", price: 1899, source: "Flipkart", image: PRODUCT_IMAGES.perfume },
  { name: "Mechanical Keyboard", price: 2499, source: "Amazon", image: PRODUCT_IMAGES.keyboard },
  { name: "Tablet", price: 12999, source: "Flipkart", image: PRODUCT_IMAGES.tablet },
  { name: "DSLR Camera", price: 34999, source: "Amazon", image: PRODUCT_IMAGES.camera },
  { name: "Denim Jeans", price: 1299, source: "Flipkart", image: PRODUCT_IMAGES.jeans },
  { name: "Gaming Mouse", price: 999, source: "Amazon", image: PRODUCT_IMAGES.mouse },
  { name: "Water Bottle", price: 499, source: "Flipkart", image: PRODUCT_IMAGES.bottle },
  { name: "Classic T-Shirt", price: 599, source: "Amazon", image: PRODUCT_IMAGES.tshirt },
  { name: "Face Cream", price: 349, source: "Flipkart", image: PRODUCT_IMAGES.cream },
];

// ===== DOM Elements =====
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");
const resultsSection = document.getElementById("resultsSection");
const minPriceEl = document.getElementById("minPrice");
const maxPriceEl = document.getElementById("maxPrice");
const avgPriceEl = document.getElementById("avgPrice");
const suggestedPriceEl = document.getElementById("suggestedPrice");
const analysisTitle = document.getElementById("analysisTitle");
const sourceComparison = document.getElementById("sourceComparison");
const productGrid = document.getElementById("productGrid");
const rangeBar = document.getElementById("rangeBar");
const suggestedMarker = document.getElementById("suggestedMarker");
const markerTooltip = document.getElementById("markerTooltip");
const rangeMin = document.getElementById("rangeMin");
const rangeMax = document.getElementById("rangeMax");
const rangeSuggested = document.getElementById("rangeSuggested");

// State
let currentPrices = [];
let currentAnalysis = null;
let currentQuery = "";
let priceList = JSON.parse(localStorage.getItem("priceList") || "[]");

// ===== Utilities =====
function formatPrice(price) {
  if (!price || price === 0) return "-";
  return "\u20B9" + price.toLocaleString("en-IN");
}

function getProductImage(title) {
  if (!title) return PRODUCT_IMAGES.default;
  const lower = title.toLowerCase();
  for (const [keyword, url] of Object.entries(PRODUCT_IMAGES)) {
    if (keyword !== "default" && lower.includes(keyword)) return url;
  }
  return PRODUCT_IMAGES.default;
}

function showLoader() {
  loader.classList.remove("hidden");
  resultsSection.classList.add("hidden");
  errorMsg.classList.add("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
  resultsSection.classList.add("hidden");
}

function showResults() {
  resultsSection.classList.remove("hidden");
  errorMsg.classList.add("hidden");
}

// ===== Navbar =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 100;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    }
  });
});

function scrollToPriceList(e) {
  e.preventDefault();
  document.getElementById("priceListSection").scrollIntoView({ behavior: "smooth" });
}

// ===== Category Buttons =====
function showCategory(category) {
  const data = CATEGORIES[category];
  if (!data) return;

  // Toggle active state
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  // Show suggestions
  const suggestionsDiv = document.getElementById("categorySuggestions");
  const tagsDiv = document.getElementById("catSuggestTags");
  const labelEl = document.getElementById("catSuggestLabel");

  labelEl.textContent = `Popular ${data.label} items:`;
  tagsDiv.innerHTML = data.items
    .map((item) => `<span class="cat-suggest-tag" onclick="quickSearch('${item}')">${item}</span>`)
    .join("");

  suggestionsDiv.classList.remove("hidden");
}

// ===== Search =====
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!requireAuth()) return;
  const query = searchInput.value.trim();
  if (!query) return;

  showLoader();
  searchBtn.disabled = true;
  searchBtn.querySelector(".btn-text").textContent = "Searching...";

  try {
    const response = await fetch(`${API_BASE}/search-product?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      showError(data.error || "Could not find this product. Try a different name.");
      return;
    }

    displayResults(data.data);
  } catch (err) {
    showError("Cannot connect to server. Make sure the backend is running.");
  } finally {
    hideLoader();
    searchBtn.disabled = false;
    searchBtn.querySelector(".btn-text").textContent = "Find Price";
  }
});

// ===== Display Results =====
function displayResults(data) {
  const { query, prices, analysis } = data;
  currentPrices = prices;
  currentAnalysis = analysis;
  currentQuery = query;

  // Update title
  const displayQuery = query.replace(/\b\w/g, (c) => c.toUpperCase());
  analysisTitle.textContent = `Market Price for "${displayQuery}"`;

  // Animate values
  animateValue(minPriceEl, analysis.minPrice);
  animateValue(maxPriceEl, analysis.maxPrice);
  animateValue(avgPriceEl, analysis.avgPrice);
  animateValue(suggestedPriceEl, analysis.suggestedPrice);

  // Reset profit calculator
  document.getElementById("buyingPrice").value = "";
  document.getElementById("profitResult").classList.add("hidden");

  renderSourceComparison(analysis.pricesBySource);
  renderProductGrid(prices);
  renderRangeBar(analysis);
  setupFilters();
  showResults();

  document.querySelector(".analysis-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function animateValue(el, target) {
  const duration = 800;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = formatPrice(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== Profit Calculator =====
function calculateProfit() {
  const buyingPrice = parseFloat(document.getElementById("buyingPrice").value);
  if (!buyingPrice || buyingPrice <= 0 || !currentAnalysis) {
    alert("Please enter your buying price (what you paid the vendor).");
    return;
  }

  const sellingPrice = currentAnalysis.suggestedPrice;
  const profit = sellingPrice - buyingPrice;
  const margin = ((profit / sellingPrice) * 100).toFixed(1);

  document.getElementById("profitSellingPrice").textContent = formatPrice(sellingPrice);
  document.getElementById("profitCost").textContent = formatPrice(buyingPrice);
  document.getElementById("profitAmount").textContent = formatPrice(Math.abs(profit));
  document.getElementById("profitMargin").textContent = margin + "%";

  // Color the profit amount
  const profitEl = document.getElementById("profitAmount");
  if (profit > 0) {
    profitEl.style.color = "var(--success)";
    profitEl.textContent = "+" + formatPrice(profit);
  } else {
    profitEl.style.color = "var(--danger)";
    profitEl.textContent = "-" + formatPrice(Math.abs(profit));
  }

  // Show advice
  const adviceEl = document.getElementById("profitAdvice");
  if (profit <= 0) {
    adviceEl.className = "profit-advice advice-loss";
    adviceEl.innerHTML = `<strong>Warning:</strong> You'll lose ${formatPrice(Math.abs(profit))} on each item! Your buying price is too high for this product. Try to negotiate a lower price with your vendor, or sell at a higher price than suggested.`;
  } else if (margin < 10) {
    adviceEl.className = "profit-advice advice-low";
    adviceEl.innerHTML = `<strong>Low Margin:</strong> Your profit is only ${margin}% per item. This is thin - consider if the volume makes it worth it, or try to get a better rate from your vendor.`;
  } else {
    adviceEl.className = "profit-advice advice-good";
    adviceEl.innerHTML = `<strong>Good to go!</strong> You'll earn ${formatPrice(profit)} profit on each item (${margin}% margin). This price is competitive with the market and gives you a healthy profit.`;
  }

  document.getElementById("profitResult").classList.remove("hidden");
}

function addToListFromProfit() {
  const buyingPrice = parseFloat(document.getElementById("buyingPrice").value) || 0;
  const sellingPrice = currentAnalysis ? currentAnalysis.suggestedPrice : 0;
  const avgPrice = currentAnalysis ? currentAnalysis.avgPrice : 0;

  addToPriceList({
    name: currentQuery.replace(/\b\w/g, (c) => c.toUpperCase()),
    marketPrice: avgPrice,
    costPrice: buyingPrice,
    sellingPrice: sellingPrice,
  });
}

// ===== Price List (Save & Print) =====
function addToPriceList(item) {
  // Check for duplicates
  const exists = priceList.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
  if (exists) {
    // Update existing
    exists.marketPrice = item.marketPrice;
    exists.costPrice = item.costPrice;
    exists.sellingPrice = item.sellingPrice;
  } else {
    priceList.push(item);
  }

  localStorage.setItem("priceList", JSON.stringify(priceList));
  renderPriceList();

  // Scroll to price list
  document.getElementById("priceListSection").scrollIntoView({ behavior: "smooth" });
}

function removeFromPriceList(index) {
  priceList.splice(index, 1);
  localStorage.setItem("priceList", JSON.stringify(priceList));
  renderPriceList();
}

function clearPriceList() {
  if (!confirm("Are you sure you want to clear your entire price list?")) return;
  priceList = [];
  localStorage.setItem("priceList", JSON.stringify(priceList));
  renderPriceList();
}

function renderPriceList() {
  const emptyDiv = document.getElementById("priceListEmpty");
  const contentDiv = document.getElementById("priceListContent");
  const tbody = document.getElementById("priceListBody");

  if (priceList.length === 0) {
    emptyDiv.classList.remove("hidden");
    contentDiv.classList.add("hidden");
    return;
  }

  emptyDiv.classList.add("hidden");
  contentDiv.classList.remove("hidden");

  tbody.innerHTML = "";
  let totalMargin = 0;

  priceList.forEach((item, index) => {
    const profit = item.sellingPrice - item.costPrice;
    const margin = item.sellingPrice > 0 ? ((profit / item.sellingPrice) * 100).toFixed(1) : 0;
    totalMargin += parseFloat(margin);

    const profitClass = profit >= 0 ? "profit-positive" : "profit-negative";
    const profitSign = profit >= 0 ? "+" : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${item.name}</strong></td>
      <td>${formatPrice(item.marketPrice)}</td>
      <td>${item.costPrice > 0 ? formatPrice(item.costPrice) : "-"}</td>
      <td><strong>${formatPrice(item.sellingPrice)}</strong></td>
      <td class="${profitClass}">${item.costPrice > 0 ? profitSign + formatPrice(profit) + " (" + margin + "%)" : "-"}</td>
      <td><button class="remove-item-btn" onclick="removeFromPriceList(${index})" title="Remove">&#10005;</button></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("totalItems").textContent = priceList.length;
  const avgM = priceList.length > 0 ? (totalMargin / priceList.length).toFixed(1) : 0;
  document.getElementById("avgMargin").textContent = avgM + "%";
}

function printPriceList() {
  const printArea = document.getElementById("printArea");
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  let rows = "";
  priceList.forEach((item, index) => {
    const profit = item.sellingPrice - item.costPrice;
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${formatPrice(item.sellingPrice)}</td>
      </tr>`;
  });

  printArea.innerHTML = `
    <div class="print-header">
      <h1>Price List - My Shop</h1>
      <p>Generated on ${date} | Powered by Pricify</p>
    </div>
    <table class="print-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="print-footer">
      <p>Prices are based on current market rates. Updated on ${date}.</p>
    </div>
  `;

  window.print();
}

// ===== Source Comparison =====
function renderSourceComparison(pricesBySource) {
  sourceComparison.innerHTML = "";
  const config = {
    amazon: { name: "Amazon", letter: "A", class: "source-amazon" },
    flipkart: { name: "Flipkart", letter: "F", class: "source-flipkart" },
  };
  for (const [source, avg] of Object.entries(pricesBySource)) {
    const c = config[source] || { name: source, letter: "?", class: "" };
    const card = document.createElement("div");
    card.className = `source-card ${c.class}`;
    card.innerHTML = `
      <div class="source-logo">${c.letter}</div>
      <div>
        <h3>${c.name} Average</h3>
        <p class="source-avg">${formatPrice(avg)}</p>
      </div>
    `;
    sourceComparison.appendChild(card);
  }
}

// ===== Product Grid =====
function renderProductGrid(prices) {
  productGrid.innerHTML = "";
  if (prices.length === 0) {
    productGrid.innerHTML = '<p style="color:var(--text-light);grid-column:1/-1;text-align:center;padding:40px;">No products found.</p>';
    return;
  }
  prices.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.source = product.source;

    const sourceName = product.source === "amazon" ? "Amazon" : "Flipkart";
    const badgeClass = product.source === "amazon" ? "badge-amazon" : "badge-flipkart";
    const imageUrl = product.image || getProductImage(product.title);
    const ratingText = product.rating || "";
    const ratingNumber = parseFloat(ratingText) || 0;
    const stars = ratingNumber > 0 ? `<span class="rating-star">&#9733;</span> ${ratingNumber.toFixed(1)}` : "No rating";

    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${imageUrl}" alt="${product.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'><span class=\\'no-image-icon\\'>&#128247;</span>No Image</div>'" />
        <span class="product-source-badge ${badgeClass}">${sourceName}</span>
      </div>
      <div class="product-info">
        <h4 title="${product.title}">${product.title}</h4>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <div class="product-rating">${stars}</div>
        ${product.url ? `<a href="${product.url}" target="_blank" rel="noopener noreferrer" class="product-link">View on ${sourceName} &#10140;</a>` : ""}
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// ===== Price Range Bar =====
function renderRangeBar(analysis) {
  const { minPrice, maxPrice, suggestedPrice } = analysis;
  rangeBar.style.width = "100%";
  if (maxPrice > minPrice) {
    const pct = ((suggestedPrice - minPrice) / (maxPrice - minPrice)) * 100;
    suggestedMarker.style.left = `${Math.min(Math.max(pct, 3), 97)}%`;
  } else {
    suggestedMarker.style.left = "50%";
  }
  markerTooltip.textContent = formatPrice(suggestedPrice);
  rangeMin.textContent = formatPrice(minPrice);
  rangeMax.textContent = formatPrice(maxPrice);
  rangeSuggested.textContent = `Sell at: ${formatPrice(suggestedPrice)}`;
}

// ===== Filter Buttons =====
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      newBtn.classList.add("active");
      const source = newBtn.dataset.source;
      renderProductGrid(source === "all" ? currentPrices : currentPrices.filter((p) => p.source === source));
    });
  });
}

// ===== Popular Searches =====
async function loadPopularSearches() {
  try {
    const response = await fetch(`${API_BASE}/popular-searches`);
    const data = await response.json();
    if (data.success && data.data.length > 0) {
      const container = document.getElementById("popularSearches");
      container.innerHTML =
        '<span class="popular-label">Recently searched:</span>' +
        data.data
          .map((item) => `<span class="popular-tag" onclick="quickSearch('${item.query}')">${item.query}</span>`)
          .join("");
    }
  } catch {
    // Keep default tags
  }
}

function quickSearch(query) {
  if (!requireAuth()) return;
  searchInput.value = query;
  searchForm.dispatchEvent(new Event("submit"));
  document.getElementById("search").scrollIntoView({ behavior: "smooth" });
}

// ===== Trending Carousel =====
function initCarousel() {
  const track1 = document.getElementById("carouselTrack");
  const track2 = document.getElementById("carouselTrack2");

  const row1 = TRENDING_PRODUCTS.slice(0, 8);
  const row2 = TRENDING_PRODUCTS.slice(8, 16);

  function createCards(products) {
    return products
      .map(
        (p) => `
      <div class="carousel-card" onclick="quickSearch('${p.name}')">
        <div class="carousel-card-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="carousel-card-body">
          <h4>${p.name}</h4>
          <p class="carousel-card-price">${formatPrice(p.price)}</p>
          <p class="carousel-card-source">${p.source}</p>
        </div>
      </div>`
      )
      .join("");
  }

  const cards1 = createCards(row1);
  track1.innerHTML = cards1 + cards1;
  const cards2 = createCards(row2);
  track2.innerHTML = cards2 + cards2;
}

// ===== Auth State Management =====
function updateAuthUI() {
  const navAuth = document.getElementById("navAuth");
  if (!navAuth) return;

  const token = localStorage.getItem("pricify_token");
  const user = JSON.parse(localStorage.getItem("pricify_user") || "null");

  if (token && user) {
    const initials = user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    navAuth.innerHTML = `
      <div class="nav-user-info">
        <div class="nav-user-avatar">${initials}</div>
        <span class="nav-user-name">${user.fullName}</span>
        <button class="nav-logout-btn" onclick="handleLogout()">Logout</button>
      </div>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="/auth.html" class="btn btn-outline btn-sm nav-login-btn" id="navLoginBtn">Login</a>
    `;
  }
}

function handleLogout() {
  localStorage.removeItem("pricify_token");
  localStorage.removeItem("pricify_user");
  updateAuthUI();
}

// ===== Initialize =====
loadPopularSearches();
initCarousel();
renderPriceList();
updateAuthUI();
