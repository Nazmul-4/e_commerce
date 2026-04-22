const axios = require("axios");
const expandKeyword = require("../../utils/expandKeyword");

const SOURCE_NAMES = ["Daraz BD", "Pickaboo", "Star Tech"];

const mapDummyProducts = (products, currencyMultiplier, currencyCode, sourceNames) => {
  return products.map((item, index) => {
    const reviewCount = Array.isArray(item.reviews)
      ? item.reviews.length
      : item.stock || 0;

    return {
      title: item.title,
      priceText: `${currencyCode} ${Math.round(item.price * currencyMultiplier)}`,
      priceValue: Math.round(item.price * currencyMultiplier),
      rating: Number(item.rating) || 0,
      reviewCount,
      image: item.thumbnail || item.images?.[0] || "",
      productUrl: `https://dummyjson.com/products/${item.id}`,
      sourceSite: sourceNames[index % sourceNames.length],
    };
  });
};

const searchDummyJson = async (term) => {
  const response = await axios.get(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(term)}`,
    {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  return response.data?.products || [];
};

const collectBDProducts = async (keyword) => {
  try {
    const expandedKeywords = expandKeyword(keyword);
    const allResults = [];

    for (const term of expandedKeywords) {
      const products = await searchDummyJson(term);
      allResults.push(...products);
    }

    const uniqueMap = new Map();
    for (const item of allResults) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }

    const uniqueProducts = [...uniqueMap.values()].slice(0, 12);

    return mapDummyProducts(uniqueProducts, 110, "BDT", SOURCE_NAMES);
  } catch (error) {
    console.error("BD collector failed:", error.message);
    return [];
  }
};

module.exports = collectBDProducts;