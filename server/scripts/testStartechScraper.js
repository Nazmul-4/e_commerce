const collectStartechProducts = require("../services/collectors/startechCollector");

(async () => {
  try {
    console.log("🚀 Starting Star Tech collector test...");

    const keyword = "laptop";

    const results = await collectStartechProducts(keyword);

    console.log("\n✅ Star Tech Collector Results:\n");
    console.log(`Total products found: ${results.length}\n`);

    results.slice(0, 10).forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Price Text: ${product.priceText}`);
      console.log(`   Price Value: ${product.priceValue}`);
      console.log(`   Product URL: ${product.productUrl}`);
      console.log(`   Image URL: ${product.image}`);
      console.log(`   Source: ${product.sourceSite}`);
      console.log(`   Country: ${product.country}`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Test script failed:", error.message);
  }
})();