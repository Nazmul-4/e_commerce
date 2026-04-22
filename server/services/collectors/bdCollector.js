const collectStartechProducts = require("./startechCollector");
const collectUccProducts = require("./uccCollector");

const collectBDProducts = async (keyword) => {
  try {
    const [startechProducts, uccProducts] = await Promise.all([
      collectStartechProducts(keyword),
      collectUccProducts(keyword),
    ]);

    const allProducts = [
      ...startechProducts,
      ...uccProducts,
    ];

    console.log(
      `✅ BD collector merged ${startechProducts.length} Star Tech + ${uccProducts.length} UCC products`
    );

    return allProducts;
  } catch (error) {
    console.error("BD collector failed:", error.message);
    return [];
  }
};

module.exports = collectBDProducts;