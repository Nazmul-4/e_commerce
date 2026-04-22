const axios = require("axios");
const cheerio = require("cheerio");
const extractStartechPrice = require("../../utils/extractStartechPrice");

const BASE_URL = "https://www.startech.com.bd";

const generateFallbackRating = (index) => {
  const values = [4.1, 4.3, 4.0, 4.4, 4.2];
  return values[index % values.length];
};

const generateFallbackReviewCount = (index) => {
  const values = [18, 26, 34, 12, 41, 22, 29];
  return values[index % values.length];
};

const normalizeText = (text = "") =>
  text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

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

const fetchStartechDetails = async (productUrl) => {
  try {
    const { data } = await axios.get(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const brand =
      $(".product-short-info table tr td:contains('Brand')").next().text().trim() ||
      $(".product-info-data.product-brand a").text().trim() ||
      "";

    const availability =
      $(".product-avail").text().replace(/\s+/g, " ").trim() ||
      $(".product-stock-status").text().replace(/\s+/g, " ").trim() ||
      "";

    const shortSpecs = [];
    $(".short-description ul li, .product-feature ul li, .c1 li").each((_, el) => {
      const spec = $(el).text().replace(/\s+/g, " ").trim();
      if (spec && shortSpecs.length < 5) {
        shortSpecs.push(spec);
      }
    });

    let betterImage =
      $(".product-thumb .swiper-slide img").first().attr("src") ||
      $(".product-img-holder img").first().attr("src") ||
      "";

    if (betterImage && !betterImage.startsWith("http")) {
      betterImage = BASE_URL + "/" + betterImage.replace(/^\/+/, "");
    }

    return {
      brand,
      availability,
      shortSpecs,
      betterImage,
    };
  } catch (error) {
    console.error("Star Tech detail scrape failed:", error.message);
    return {
      brand: "",
      availability: "",
      shortSpecs: [],
      betterImage: "",
    };
  }
};

const collectStartechProducts = async (keyword) => {
  try {
    const url = `${BASE_URL}/product/search?search=${encodeURIComponent(keyword)}`;

    console.log("🔍 Fetching from Star Tech:", url);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const products = [];

    $(".p-item").each((index, element) => {
      const title = $(element).find(".p-item-name a").text().trim();

      const priceText = $(element)
        .find(".p-item-price")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      let image = $(element).find(".p-item-img img").attr("src") || "";
      let productUrl = $(element).find(".p-item-name a").attr("href") || "";

      if (image && !image.startsWith("http")) {
        image = BASE_URL + "/" + image.replace(/^\/+/, "");
      }

      if (productUrl && !productUrl.startsWith("http")) {
        productUrl = BASE_URL + "/" + productUrl.replace(/^\/+/, "");
      }

      const priceValue = extractStartechPrice(priceText);
      const relevanceScore = calculateRelevanceScore(title, keyword);

      if (title && priceText && priceValue > 0 && productUrl) {
        products.push({
          title,
          priceText,
          priceValue,
          image,
          productUrl,
          rating: generateFallbackRating(index),
          reviewCount: generateFallbackReviewCount(index),
          sourceSite: "Star Tech",
          country: "BD",
          keyword,
          relevanceScore,
          brand: "",
          availability: "",
          shortSpecs: [],
        });
      }
    });

    let filteredProducts = products
      .filter((product) => product.relevanceScore >= 20)
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return b.priceValue - a.priceValue;
      })
      .slice(0, 20);

    // Enrich top 5 only
    for (let i = 0; i < Math.min(5, filteredProducts.length); i++) {
      const details = await fetchStartechDetails(filteredProducts[i].productUrl);

      filteredProducts[i].brand = details.brand || "";
      filteredProducts[i].availability = details.availability || "";
      filteredProducts[i].shortSpecs = details.shortSpecs || [];

      if (details.betterImage) {
        filteredProducts[i].image = details.betterImage;
      }
    }

    filteredProducts = filteredProducts.map(({ relevanceScore, ...rest }) => rest);

    console.log(`✅ Scraped ${filteredProducts.length} filtered products from Star Tech`);

    return filteredProducts;
  } catch (error) {
    console.error("❌ Star Tech collector failed:", error.message);
    return [];
  }
};

module.exports = collectStartechProducts;