const countryConfig = require("../config/countryConfig");

// BIG brand list (realistic)
const brands = [
  "Acer","Asus","HP","Dell","Lenovo","MSI","Apple","Walton",
  "Chuwi","Gigabyte","Samsung","Xiaomi","Huawei","Razer",
  "Netac","Adata","Corsair","Logitech","Rapoo","A4Tech",
  "Redmi","Realme","Honor","OnePlus","Sony","Toshiba"
];

// 🔥 SMART BRAND DETECTION
const extractBrand = (title = "") => {
  const lower = title.toLowerCase();

  // 1. direct match
  for (const brand of brands) {
    if (lower.includes(brand.toLowerCase())) {
      return brand;
    }
  }

  // 2. fallback: first word
  const firstWord = title.split(" ")[0];
  if (firstWord.length > 2) {
    return firstWord;
  }

  return "Generic";
};

// ⚡ FAST AVAILABILITY (NO SCRAPING)
const detectAvailability = (priceValue, title = "") => {
  if (!priceValue || priceValue <= 0) return "Out of Stock";

  const t = title.toLowerCase();

  if (t.includes("out of stock")) return "Out of Stock";
  if (t.includes("pre order")) return "Pre-order";

  return "In Stock"; // default fast assumption
};

const normalizeProduct = ({
  title,
  priceText,
  priceValue,
  rating,
  reviewCount,
  image,
  sourceSite,
  country,
  productUrl,
  keyword,
  searchJobId,
  brand,
  availability,
  shortSpecs,
}) => {
  const config = countryConfig[country];

  const safeTitle = title?.trim() || "Unknown Product";
  const safePriceValue = Number(priceValue) || 0;

  // 🔥 IMPROVED VALUES
  const finalBrand =
    brand?.trim() ||
    extractBrand(safeTitle);

  const finalAvailability =
    availability?.trim() ||
    detectAvailability(safePriceValue, safeTitle);

  return {
    title: safeTitle,
    priceText: priceText || `${config?.currency || "N/A"} ${safePriceValue}`,
    priceValue: safePriceValue,
    currency: config?.currency || "N/A",
    rating: Number(rating) || 0,
    reviewCount: Number(reviewCount) || 0,

    image:
      image && image.trim()
        ? image
        : `https://picsum.photos/seed/${encodeURIComponent(safeTitle)}/300/200`,

    sourceSite: sourceSite || "Unknown Source",
    country,
    productUrl: productUrl || "",
    keyword,
    score: 0,
    searchJobId,

    // ✅ FIXED FIELDS
    brand: finalBrand,
    availability: finalAvailability,
    shortSpecs: Array.isArray(shortSpecs) ? shortSpecs.slice(0, 5) : [],
  };
};

module.exports = normalizeProduct;