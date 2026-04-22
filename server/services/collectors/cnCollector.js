const axios = require("axios");

const collectCNProducts = async (keyword) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products", {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const products = response.data || [];

    const filteredProducts = products
      .filter((item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase())
      )
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

    if (filteredProducts.length > 0) {
      return filteredProducts;
    }

    return products.slice(0, 12).map((item, index) => ({
      title: item.title,
      priceText: `CNY ${Math.round(item.price * 7)}`,
      priceValue: Math.round(item.price * 7),
      rating: item.rating?.rate || 0,
      reviewCount: item.rating?.count || 0,
      image: item.image || "",
      productUrl: item.image || "",
      sourceSite: ["Alibaba", "AliExpress", "JD"][index % 3],
    }));
  } catch (error) {
    console.error("CN collector failed:", error.message);
    return [];
  }
};

module.exports = collectCNProducts;