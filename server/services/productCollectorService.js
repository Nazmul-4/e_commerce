const collectBDProducts = require("./collectors/bdCollector");
const collectINProducts = require("./collectors/inCollector");
const collectCNProducts = require("./collectors/cnCollector");
const normalizeProduct = require("../utils/normalizeProduct");

const collectProductsByCountry = async ({ keyword, country, searchJobId }) => {
  let rawProducts = [];

  if (country === "BD") {
    rawProducts = await collectBDProducts(keyword);
  } else if (country === "IN") {
    rawProducts = await collectINProducts(keyword);
  } else if (country === "CN") {
    rawProducts = await collectCNProducts(keyword);
  } else {
    throw new Error("Unsupported country");
  }

  const normalizedProducts = rawProducts.map((product) =>
    normalizeProduct({
      ...product,
      country,
      keyword,
      searchJobId,
    })
  );

  return normalizedProducts;
};

module.exports = collectProductsByCountry;