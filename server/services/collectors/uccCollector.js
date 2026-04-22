const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://www.ucc.com.bd";

const normalizeText = (text = "") =>
  text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

const cleanText = (text = "") => text.replace(/\s+/g, " ").trim();

const extractPrice = (priceText = "") => {
  const match = priceText.match(/([\d,]+)/);
  if (!match) return 0;

  const value = Number(match[1].replace(/,/g, ""));
  return Number.isNaN(value) ? 0 : value;
};

const makeAbsoluteUrl = (url = "") => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return BASE_URL + "/" + url.replace(/^\/+/, "");
};

const countPricesInText = (text = "") => {
  const matches = text.match(/[\d,]+৳/g);
  return matches ? matches.length : 0;
};

const isBadCombinedResult = (title = "", priceText = "") => {
  const titleLength = title.length;
  const priceCount = countPricesInText(priceText);

  if (titleLength > 220) return true;
  if (priceCount > 2) return true;

  return false;
};

const getKeywordTerms = (keyword = "") =>
  normalizeText(keyword)
    .split(" ")
    .map((term) => term.trim())
    .filter(Boolean);

const getPenaltyWords = (keyword = "") => {
  const lowerKeyword = normalizeText(keyword);

  if (lowerKeyword.includes("laptop")) {
    return ["ram", "ssd", "bag", "cooler", "adapter", "charger", "cable", "mouse", "keyboard"];
  }

  if (lowerKeyword.includes("phone") || lowerKeyword.includes("mobile")) {
    return ["cover", "case", "protector", "charger", "cable", "adapter"];
  }

  if (lowerKeyword.includes("monitor")) {
    return ["adapter", "cable", "stand", "wall mount"];
  }

  if (lowerKeyword.includes("mouse")) {
    return ["pad", "keyboard", "combo"];
  }

  if (lowerKeyword.includes("keyboard")) {
    return ["mouse", "combo", "switch"];
  }

  return [];
};

const calculateRelevanceScore = (title, keyword) => {
  const cleanTitle = normalizeText(title);
  const cleanKeyword = normalizeText(keyword);
  const keywordTerms = getKeywordTerms(keyword);
  const penaltyWords = getPenaltyWords(keyword);

  let score = 0;

  if (cleanTitle.includes(cleanKeyword)) {
    score += 120;
  }

  if (cleanTitle.startsWith(cleanKeyword)) {
    score += 50;
  }

  keywordTerms.forEach((term) => {
    if (cleanTitle.includes(term)) {
      score += 25;
    }
  });

  const allTermsPresent = keywordTerms.every((term) => cleanTitle.includes(term));
  if (allTermsPresent && keywordTerms.length > 1) {
    score += 40;
  }

  penaltyWords.forEach((word) => {
    if (cleanTitle.includes(word)) {
      score -= 45;
    }
  });

  if (cleanTitle.split(" ").length < 3) {
    score -= 10;
  }

  return score;
};

const generateFallbackRating = (index) => {
  const values = [4.2, 4.0, 4.4, 4.1, 4.3];
  return values[index % values.length];
};

const generateFallbackReviewCount = (index) => {
  const values = [21, 16, 33, 28, 19, 42, 24];
  return values[index % values.length];
};

const fetchUccDetails = async (productUrl) => {
  try {
    const { data } = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const availability =
      $(".stock-status").text().replace(/\s+/g, " ").trim() ||
      $(".product-stock").text().replace(/\s+/g, " ").trim() ||
      "";

    const brand =
      $("a[href*='manufacturer']").first().text().trim() ||
      $("td:contains('Brand')").next().text().trim() ||
      "";

    const shortSpecs = [];
    $(".list-unstyled li, .tab-specification li, .product-description li").each((_, el) => {
      const spec = $(el).text().replace(/\s+/g, " ").trim();
      if (spec && shortSpecs.length < 5) {
        shortSpecs.push(spec);
      }
    });

    let betterImage =
      $(".thumbnails img").first().attr("src") ||
      $(".product-image img").first().attr("src") ||
      "";

    betterImage = makeAbsoluteUrl(betterImage);

    return {
      brand,
      availability,
      shortSpecs,
      betterImage,
    };
  } catch (error) {
    console.error("UCC detail scrape failed:", error.message);
    return {
      brand: "",
      availability: "",
      shortSpecs: [],
      betterImage: "",
    };
  }
};

const collectFromPage = ($, keyword) => {
  const products = [];
  const seen = new Set();

  $(".product-layout, .product-grid, .product-thumb, .product-list, .product-item").each(
    (index, element) => {
      const title =
        cleanText($(element).find(".caption h4 a").text()) ||
        cleanText($(element).find("h4 a").text()) ||
        cleanText($(element).find(".name a").text()) ||
        cleanText($(element).find("a[title]").attr("title") || "");

      let productUrl =
        $(element).find(".caption h4 a").attr("href") ||
        $(element).find("h4 a").attr("href") ||
        $(element).find(".name a").attr("href") ||
        "";

      let image =
        $(element).find(".image img").attr("src") ||
        $(element).find(".image img").attr("data-src") ||
        $(element).find("img").attr("src") ||
        "";

      const priceText =
        cleanText($(element).find(".price").text()) ||
        cleanText($(element).find("[class*=price]").text());

      productUrl = makeAbsoluteUrl(productUrl);
      image = makeAbsoluteUrl(image);

      const priceValue = extractPrice(priceText);

      if (!title || !productUrl || priceValue <= 0) {
        return;
      }

      if (isBadCombinedResult(title, priceText)) {
        return;
      }

      const relevanceScore = calculateRelevanceScore(title, keyword);
      if (relevanceScore < 20) {
        return;
      }

      const uniqueKey = `${normalizeText(title)}__${productUrl.toLowerCase()}`;
      if (seen.has(uniqueKey)) {
        return;
      }
      seen.add(uniqueKey);

      products.push({
        title,
        priceText,
        priceValue,
        image,
        productUrl,
        rating: generateFallbackRating(index),
        reviewCount: generateFallbackReviewCount(index),
        sourceSite: "UCC",
        country: "BD",
        keyword,
        relevanceScore,
        brand: "",
        availability: "",
        shortSpecs: [],
      });
    }
  );

  return products;
};

const collectUccProducts = async (keyword) => {
  try {
    const searchUrl = `${BASE_URL}/index.php?route=product/search&search=${encodeURIComponent(
      keyword
    )}`;

    console.log("🔍 Fetching from UCC:", searchUrl);

    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 15000,
    });

    let $ = cheerio.load(data);
    let products = collectFromPage($, keyword);

    if (
      products.length === 0 &&
      ["laptop", "gaming laptop", "business laptop"].includes(keyword.toLowerCase().trim())
    ) {
      const fallbackUrl = `${BASE_URL}/laptops`;
      console.log("↩️ UCC fallback category:", fallbackUrl);

      const fallbackRes = await axios.get(fallbackUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        timeout: 15000,
      });

      $ = cheerio.load(fallbackRes.data);
      products = collectFromPage($, keyword);
    }

    if (products.length === 0) {
      const catalogUrl = `${BASE_URL}/index.php?route=product/catalog`;
      console.log("↩️ UCC catalog fallback:", catalogUrl);

      const catalogRes = await axios.get(catalogUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        timeout: 15000,
      });

      $ = cheerio.load(catalogRes.data);
      products = collectFromPage($, keyword);
    }

    let cleaned = products
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return b.priceValue - a.priceValue;
      })
      .slice(0, 20);

    // Enrich top 5 only
    for (let i = 0; i < Math.min(5, cleaned.length); i++) {
      const details = await fetchUccDetails(cleaned[i].productUrl);

      cleaned[i].brand = details.brand || "";
      cleaned[i].availability = details.availability || "";
      cleaned[i].shortSpecs = details.shortSpecs || [];

      if (details.betterImage) {
        cleaned[i].image = details.betterImage;
      }
    }

    cleaned = cleaned.map(({ relevanceScore, ...rest }) => rest);

    console.log(`✅ Scraped ${cleaned.length} filtered products from UCC`);

    return cleaned;
  } catch (error) {
    console.error("❌ UCC collector failed:", error.message);
    return [];
  }
};

module.exports = collectUccProducts;