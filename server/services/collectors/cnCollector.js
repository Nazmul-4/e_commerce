const axios = require("axios");
const expandKeyword = require("../../utils/expandKeyword");

const collectCNProducts = async (keyword) => {
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
        priceText: `CNY ${Math.round(item.price * 7)}`,
        priceValue: Math.round(item.price * 7),
        rating: item.rating?.rate || 0,
        reviewCount: item.rating?.count || 0,
        image: item.image || "",
        productUrl: item.image || "",
        sourceSite: ["Alibaba", "AliExpress", "JD"][index % 3],
      }));

    return filteredProducts;
  } catch (error) {
    console.error("CN collector failed:", error.message);
    return [];
  }
};

module.exports = collectCNProducts;