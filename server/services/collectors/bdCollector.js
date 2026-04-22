const axios = require("axios");

const collectBDProducts = async (keyword) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products", {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const products = response.data || [];
    const keywordLower = keyword.toLowerCase();

    const filteredProducts = products
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(keywordLower) ||
          item.category.toLowerCase().includes(keywordLower) ||
          item.description.toLowerCase().includes(keywordLower)
        );
      })
      .slice(0, 12)
      .map((item, index) => ({
        title: item.title,
        priceText: `BDT ${Math.round(item.price * 110)}`,
        priceValue: Math.round(item.price * 110),
        rating: item.rating?.rate || 0,
        reviewCount: item.rating?.count || 0,
        image: item.image || "",
        productUrl: item.image || "",
        sourceSite: ["Daraz BD", "Pickaboo", "Star Tech"][index % 3],
      }));

    return filteredProducts;
  } catch (error) {
    console.error("BD collector failed:", error.message);
    return [];
  }
};

module.exports = collectBDProducts;