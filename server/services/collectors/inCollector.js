const axios = require("axios");
const expandKeyword = require("../../utils/expandKeyword");

const collectINProducts = async (keyword) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products", {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const products = response.data || [];
    const expandedKeywords = expandKeyword(keyword);

    const filteredProducts = products
      .filter((item) => {
        const searchableText = `${item.title} ${item.category} ${item.description}`.toLowerCase();

        return expandedKeywords.some((term) => searchableText.includes(term));
      })
      .slice(0, 12)
      .map((item, index) => ({
        title: item.title,
        priceText: `INR ${Math.round(item.price * 85)}`,
        priceValue: Math.round(item.price * 85),
        rating: item.rating?.rate || 0,
        reviewCount: item.rating?.count || 0,
        image: item.image || "",
        productUrl: item.image || "",
        sourceSite: ["Flipkart", "Amazon India", "Croma"][index % 3],
      }));

    return filteredProducts;
  } catch (error) {
    console.error("IN collector failed:", error.message);
    return [];
  }
};

module.exports = collectINProducts;