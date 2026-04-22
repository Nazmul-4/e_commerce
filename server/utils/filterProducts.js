const filterProducts = (products = []) => {
  const seen = new Set();

  const filtered = products.filter((product) => {
    const title = product.title?.trim();
    const productUrl = product.productUrl?.trim();
    const priceValue = Number(product.priceValue) || 0;

    // Must have title
    if (!title) return false;

    // Must have product URL
    if (!productUrl) return false;

    // Skip broken/demo-empty javascript links
    if (
      productUrl.startsWith("javascript:") ||
      productUrl.startsWith("#")
    ) {
      return false;
    }

    // price must be greater than 0
    if (priceValue <= 0) return false;

    // duplicate check by lowercased title + url
    const uniqueKey = `${title.toLowerCase()}__${productUrl.toLowerCase()}`;

    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });

  return filtered;
};

module.exports = filterProducts;